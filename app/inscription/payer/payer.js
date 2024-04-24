import { useEffect, useState } from 'react';
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { LoadingPayer } from './loading-payer';
import { supabase } from '../../../utils/supabaseClient';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';

export function Payer({ id }) {
  const [studentData, setStudentData] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [photoURL, setPhotoURL] = useState(null);
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStudentData() {
      try {
        const { data, error } = await supabase
          .from('demandes')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        setStudentData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchStudentData();
    }
  }, [id]);

  useEffect(() => {
    async function fetchPrice() {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select(studentData.grade_level)
          .eq('name', 'Inscription')
          .single();

        if (error) {
          throw error;
        }

        setPrice(data[studentData.grade_level]);
      } catch (error) {
        setError(error.message);
      }
    }

    if (studentData) {
      fetchPrice();
    }
  }, [studentData]);

  useEffect(() => {
    async function fetchIsPaid() {
      try {
        const { data, error } = await supabase
          .from('payment')
          .select('inscription')
          .eq('student_id', id)
          .single();

        if (error) {
          throw error;
        }

        setIsPaid(data && data.inscription !== null);
      } catch (error) {
        setError(error.message);
      }
    }

    if (studentData) {
      fetchIsPaid();
    }
  }, [studentData]);

  const handlePhotoUpload = async (file) => {
    try {
      const { data, error } = await supabase.storage
        .from('student_photos')
        .upload(`student_photos/${studentData.id}`, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        throw error;
      }

      const photoURL = `https://doqgfvlrcmvyhjaksyml.supabase.co/storage/v1/object/public/student_photos/student_photos/${studentData.id}`;
      setPhotoURL(photoURL);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const confirmed = await Swal.fire({
        title: 'Êtes-vous sûr?',
        text: "Voulez-vous soumettre ces informations est finaliser l'inscription?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmer',
        cancelButtonText: 'Anuler'
      });

      if (confirmed.isConfirmed) {
        if (!photoURL) {
          // Display an informational alert instead of an error
          await Swal.fire({
            icon: 'info',
            title: 'Attendez un instant',
            text: 'Veuillez patienter pendant que la photo est téléchargée...',
            confirmButtonColor: '#3085d6',
          });
          return; // Exit the function without proceeding further
        }

        const { data: newStudent, error: newStudentError } = await supabase
          .from('students')
          .insert([
            {
              id: studentData.id,
              first_name: studentData.first_name,
              last_name: studentData.last_name,
              date_of_birth: studentData.date_of_birth,
              gender: studentData.gender,
              grade_level: studentData.grade_level,
              current_school_level: studentData.current_school_level,
              current_establishment: studentData.current_establishment,
              address: values.address,
              bloodtype: values.bloodType,
              allergies: values.allergies,
              medical_conditions: values.medicalConditions,
              photo: photoURL,
            }
          ]);

        if (newStudentError) {
          throw newStudentError;
        }

        const { data: paymentData, error: paymentError } = await supabase
          .from('payment')
          .insert([
            {
              student_id: studentData.id,
              student_name: `${studentData.first_name} ${studentData.last_name}`,
              inscription: price,
            }
          ]);

        if (paymentError) {
          throw paymentError;
        }

        // Delete the request from the 'demandes' table
        const { error: deleteError } = await supabase
          .from('demandes')
          .delete()
          .eq('id', studentData.id);

        if (deleteError) {
          throw deleteError;
        }

        setIsPaid(true);
        Swal.fire({
          icon: 'success',
          title: 'Élève inscrit avec succès',
          text: 'Les données de l\'étudiant ont été soumises avec succès.',
          confirmButtonColor: '#3085d6',
        });

        printReceipt(); // Call function to print receipt
      }
    } catch (error) {
      setError(error.message);
      Swal.fire({
        icon: 'error',
        title: 'Erreur!',
        text: `Une erreur s'est produite lors de la soumission des données: ${error.message}`,
        confirmButtonColor: '#3085d6',
      });
    }
  };

  const printReceipt = () => {
    const currentDate = new Date().toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const printableContent = `
    <div style="text-align: center;">
      <img src="/ESTC.png" alt="Logo" style="width: 100px; height: 100px;">
      <h1 style="margin-top: 20px;">École Les Charmilles</h1>
      <h2>Reçu d'inscription</h2>
      <p>Date: ${currentDate}</p>
    </div>
    <table style="width: 100%; margin-top: 20px;">
      <tr>
        <td><strong>Nom:</strong></td>
        <td>${studentData.first_name} ${studentData.last_name}</td>
      </tr>
      <tr>
        <td><strong>Niveau:</strong></td>
        <td>${studentData.grade_level}</td>
      </tr>
      <tr>
        <td><strong>Prix:</strong></td>
        <td>${price} DH</td>
      </tr>
      <tr>
        <td><strong>Statut:</strong></td>
        <td>Payé</td>
      </tr>
    </table>
  `;

    const printWindow = window.open('', '_blank');
    printWindow.document.open();
    printWindow.document.write(`
    <html>
      <head>
        <title>Reçu d'inscription</title>
        <style>
          body {
            font-family: Arial, sans-serif;
          }
          table {
            border-collapse: collapse;
            width: 100%;
          }
          th, td {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 8px;
          }
          th {
            background-color: #f2f2f2;
          }
        </style>
      </head>
      <body>${printableContent}</body>
    </html>
  `);
    printWindow.document.close();
    printWindow.print();
  };


  const validationSchema = Yup.object().shape({
    bloodType: Yup.string().required('Le groupe sanguin est requis'),
    allergies: Yup.string(),
    medicalConditions: Yup.string(),
    address: Yup.string().required('L\'adresse est requise'),
  });

  if (loading) {
    return <LoadingPayer />;
  }

  return (
    <div className="container w-3/4 mx-auto my-8 px-4 md:px-6">
      {studentData && (
        <div className="text-center">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Informations de l'Étudiant</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Nom</p>
                <p className="font-medium">{`${studentData.first_name.charAt(0).toUpperCase() + studentData.first_name.slice(1)} ${studentData.last_name.charAt(0).toUpperCase() + studentData.last_name.slice(1)}`}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Niveau</p>
                <p className="font-medium">{studentData.grade_level}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">ID de l'Étudiant</p>
                <p className="font-medium">{studentData.id}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Détails Supplémentaires</h2>
            <Formik
              initialValues={{
                bloodType: '',
                allergies: '',
                medicalConditions: '',
                address: '',
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, values }) => (
                <Form>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bloodType">Groupe Sanguin <span className="text-red-500">*</span></Label>
                      <Field as="select" id="bloodType" name="bloodType" className="block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                        <option value="">Sélectionner le groupe sanguin</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </Field>
                      <ErrorMessage name="bloodType" component="div" className="text-red-500" />
                    </div>
                    <div>
                      <Label htmlFor="allergies">Allergies</Label>
                      <Field as={Textarea} id="allergies" name="allergies" placeholder="Entrer les allergies" />
                      <ErrorMessage name="allergies" component="div" className="text-red-500" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="medicalConditions">Conditions Médicales</Label>
                    <Field as={Textarea} id="medicalConditions" name="medicalConditions" placeholder="Entrer les conditions médicales" />
                    <ErrorMessage name="medicalConditions" component="div" className="text-red-500" />
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="address">Adresse <span className="text-red-500">*</span></Label>
                    <Field as={Textarea} id="address" name="address" placeholder="Entrer l'adresse de l'étudiant" />
                    <ErrorMessage name="address" component="div" className="text-red-500" />
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="photo">Photo <span className="text-red-500">*</span></Label>
                    <input
                      id="photo"
                      name="photo"
                      type="file"
                      onChange={(event) => handlePhotoUpload(event.target.files[0])}
                      accept="image/*"
                      className="block w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6 mt-4">
                    <h2 className="text-2xl font-bold mb-4">Détails de Paiement</h2>
                    <div>
                      <div>
                        <p>Frais d'Inscription ={'>'} Niveau: {studentData.grade_level} : <span className="text-green-500 font-bold"> {price} DH</span></p>
                        <div className="mt-2">
                          <p className={isPaid ? 'font-medium text-green-500 font-bold' : 'font-medium text-red-500 font-bold'}>
                            {isPaid ? 'Payé' : 'Non Payé'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {!isPaid && (
                    <Button type="submit" variant="botonakhdra" disabled={!studentData}>
                      Finaliser Inscription
                    </Button>
                  )}
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
}
