import { useEffect, useState } from 'react';
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { supabase } from '../../../utils/supabaseClient';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';

export function Payer() {
  const [studentData, setStudentData] = useState(null);
  const [isPaid, setIsPaid] = useState(false); 
  const [photoURL, setPhotoURL] = useState(null); 

  useEffect(() => {
    async function fetchStudentData() {
      try {
        const { data, error } = await supabase
          .from('demandes')
          .select('*')
          .eq('id',18) 
          .single();

        if (error) {
          throw error;
        }

        setStudentData(data);
      } catch (error) {
        console.error('Error fetching student data:', error.message);
      }
    }

    fetchStudentData();
  }, []);

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
      console.log('Done');
      console.log(photoURL)

      
      setPhotoURL(photoURL);
    } catch (error) {
      console.error('Error uploading photo:', error.message);
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
          throw new Error('Veuillez télécharger une photo.');
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
              inscription: true,
            }
          ]);

        if (paymentError) {
          throw paymentError;
        }

        setIsPaid(true);
        console.log('Student marked as paid:', studentData.id);

        
        Swal.fire({
          icon: 'success',
          title: 'Élève inscrit avec succès',
          text: 'Les données de l\'étudiant ont été soumises avec succès.',
          confirmButtonColor: '#3085d6',
        });
      }
    } catch (error) {
      console.error('Error marking as paid:', error.message);
      
      Swal.fire({
        icon: 'error',
        title: 'Erreur!',
        text: `Une erreur s'est produite lors de la soumission des données: ${error.message}`,
        confirmButtonColor: '#3085d6',
      });
    }
  };


  const validationSchema = Yup.object().shape({
    bloodType: Yup.string().required('Blood type is required'),
    allergies: Yup.string().required('Allergies are required'),
    medicalConditions: Yup.string().required('Medical conditions are required'),
    address: Yup.string().required('Address is required'),
  });

  return (
    <div className="container w-3/4 mx-auto my-8 px-4 md:px-6">
      {studentData && (
        <div className="text-center">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Student Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Name</p>
                <p className="font-medium">{`${studentData.first_name} ${studentData.last_name}`}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Grade</p>
                <p className="font-medium">{studentData.grade_level}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Student ID</p>
                <p className="font-medium">{studentData.id}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Additional Details</h2>
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
                      <Label htmlFor="bloodType">Blood Type</Label>
                      <Field as="select" id="bloodType" name="bloodType" className="block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                        <option value="">Select blood type</option>
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
                      <Field as={Textarea} id="allergies" name="allergies" placeholder="Enter any allergies" />
                      <ErrorMessage name="allergies" component="div" className="text-red-500" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="medicalConditions">Medical Conditions</Label>
                    <Field as={Textarea} id="medicalConditions" name="medicalConditions" placeholder="Enter any medical conditions" />
                    <ErrorMessage name="medicalConditions" component="div" className="text-red-500" />
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="address">Address</Label>
                    <Field as={Textarea} id="address" name="address" placeholder="Enter student's address" />
                    <ErrorMessage name="address" component="div" className="text-red-500" />
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="photo">Photo</Label>
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
                    <h2 className="text-2xl font-bold mb-4">Payment Details</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Signup Fee</p>
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{isPaid ? 'Paid' : 'Not Paid'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button type="submit" variant="botonakhdra" disabled={!studentData}>
                    Finaliser Inscription
                  </Button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
}

