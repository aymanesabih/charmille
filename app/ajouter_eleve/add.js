"use client";
// Payer.js
import { useEffect, useState } from 'react';
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { LoadingPayer } from '../../components/component/loading-payer';
import { supabase } from '../../utils/supabaseClient';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { AdditionalDetailsForm } from '../../components/component/AdditionalDetailsForm';
import { ParentsForm } from '../../components/component/ParentsForm';
import { StudentForm } from '../../components/component/StudentForm';

export function Add() {

    const [studentData, setStudentData] = useState(null);
    const [isPaid, setIsPaid] = useState(false);
    const [photoURL, setPhotoURL] = useState(null);
    const [price, setPrice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const initialValues = {
        additional: {
            bloodType: '',
            allergies: '',
            medicalConditions: '',
            address: '',
        },
        student: {
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            gender: '',
            age: '',
            gradeLevel: '',
            currentSchoolLevel: '',
            currentEstablishment: '',
        },
        parents: [
            {
                parentFirstName: '',
                parentLastName: '',
                phoneNumber: '',
                email: '',
                relationship: '',
            },
        ],
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
                const firstName = values.student.firstName;
                const lastName = values.student.lastName;
                const gradeLevel = values.student.gradeLevel;

                const { data: newStudent, error: newStudentError } = await supabase
                    .from('students')
                    .insert([
                        {
                            first_name: values.student.firstName,
                            last_name: values.student.lastName,
                            date_of_birth: values.student.dateOfBirth,
                            gender: values.student.gender,
                            grade_level: values.student.gradeLevel,
                            current_school_level: values.student.currentSchoolLevel,
                            current_establishment: values.student.currentEstablishment,
                            address: values.address,
                            bloodtype: values.bloodType,
                            allergies: values.allergies,
                            medical_conditions: values.medicalConditions,
                            photo: 'wait',
                        }
                    ]);

                if (newStudentError) {
                    throw newStudentError;
                }
                const { data: fetchedStudentData, error: fetchStudentError } = await supabase
                    .from('students')
                    .select('id')
                    .eq('first_name', values.student.firstName)
                    .eq('last_name', values.student.lastName)
                    .single();

                if (fetchStudentError) {
                    throw fetchStudentError;
                }

                if (!fetchedStudentData) {
                    throw new Error('Failed to retrieve student ID');
                }

                const studentId = fetchedStudentData.id;

                for (const parent of values.parents) {
                    const { data: parentData, error: parentError } = await supabase.from('parents').insert([
                        {
                            student_id: studentId,
                            first_name: parent.parentFirstName,
                            last_name: parent.parentLastName,
                            phone_number: parent.phoneNumber,
                            email: parent.email,
                            relationship: parent.relationship,
                        }
                    ]);
                    if (parentError) {
                        throw parentError;
                    }
                }

                const { data: paymentData, error: paymentError } = await supabase
                    .from('payment')
                    .insert([
                        {
                            student_id: studentId,
                            student_name: `${values.student.firstName} ${values.student.lastName}`,
                            inscription: 1300,
                        }
                    ]);

                if (paymentError) {
                    throw paymentError;
                }

                setIsPaid(true);
                Swal.fire({
                    icon: 'success',
                    title: 'Élève inscrit avec succès',
                    text: 'Les données de l\'étudiant ont été soumises avec succès.',
                    confirmButtonColor: '#3085d6',
                });

                printReceipt(firstName, lastName, gradeLevel, price);
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

    const printReceipt = (firstName, lastName, gradeLevel, price) => {
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
        <td>${firstName} ${lastName}</td>
      </tr>
      <tr>
        <td><strong>Niveau:</strong></td>
        <td>${gradeLevel}</td>
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
        student: Yup.object().shape({
            firstName: Yup.string().required('Le prénom est requis'),
            lastName: Yup.string().required('Le nom de famille est requis'),
            dateOfBirth: Yup.date().required('La date de naissance est requise'),
            gender: Yup.string().required('Le genre est requis'),
            age: Yup.number().required("L'âge est requis"),
            gradeLevel: Yup.string().required('Le niveau de classe est requis'),
            currentSchoolLevel: Yup.string().required('Le niveau scolaire actuel est requis'),
        }),
        parents: Yup.array().of(
            Yup.object().shape({
                parentFirstName: Yup.string().required('Le prénom est requis'),
                parentLastName: Yup.string().required('Le nom de famille est requis'),
                phoneNumber: Yup.string().required('Le numéro de téléphone est requis'),
                email: Yup.string().email('Adresse e-mail invalide').required('L\'e-mail est requis'),
                relationship: Yup.string().required('La relation est requise'),
            })
        ),
    });

    // if (loading) {
    //     return <LoadingPayer />;
    // }
    const handleGradeLevelChange = async (grade) => {
        try {
            const { data, error } = await supabase
                .from('settings')
                .select(grade)
                .eq('name', 'Inscription')
                .single();

            if (error) {
                throw error;
            }
            const sanitizedGrade = grade.replace(/\s+/g, '');
            setPrice(data[sanitizedGrade]);
        } catch (error) {
            setError(error.message);
        }
    };
    const calculateAge = (birthdate) => {
        const today = new Date();
        const birthDate = new Date(birthdate);
        let age = today.getFullYear() - birthDate.getFullYear();
        const month = today.getMonth() - birthDate.getMonth();
        if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age.toString();
    };
    return (
        <div className="container w-3/4 mx-auto my-8 px-4 md:px-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, setFieldValue }) => (
                        <div className="text-center">
                            <Form className="space-y-4">
                                <StudentForm values={values}
                                    handleGradeLevelChange={handleGradeLevelChange}
                                    calculateAge={calculateAge}
                                    setFieldValue={setFieldValue}
                                />
                                <AdditionalDetailsForm/>
                                <ParentsForm values={values}
                                    setFieldValue={setFieldValue} />

                                <div className="bg-white rounded-lg shadow-md p-6 mt-4">
                                    <h2 className="text-2xl font-bold mb-4">Détails de Paiement</h2>
                                    <div>
                                        <div>
                                            <p>Frais d'Inscription <span className="text-green-500 font-bold"> {price} DH</span></p>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <button type="submit" className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md">Soumettre</button>
                                </div>
                            </Form>
                        </div>
                    )}
                </Formik>

            </div>

        </div>
    );
}
