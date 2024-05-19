"use client";
import React from 'react';
import { supabase } from '../../utils/supabaseClient';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';

export function Recrutement() {
    const initialValues = {
        name: '',
        email: '',
        phone: '',
        experience: '',
        education: '',
        resume: null
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Le nom est requis'),
        email: Yup.string().email('Adresse email invalide').required('Adresse email est requise'),
        phone: Yup.string().required('Le numéro de téléphone est requis'),
        experience: Yup.string().required('Ce champ est requis'),
        education: Yup.string().required('Ce champ est requis'),
        resume: Yup.mixed().required('Veuillez déposer votre CV')
    });

    const handleSubmit = async (values, { resetForm }) => {
        try {
            Swal.fire({
                title: 'Téléchargement...',
                text: 'Veuillez patienter pendant que nous soumettons vos données.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('cvs')
                .upload(values.resume.name, values.resume);

            if (uploadError) {
                throw new Error(`Erreur de téléchargement : ${uploadError.message}`);
            }
            const { data: urlData, error: urlError } = supabase.storage
                .from('cvs')
                .getPublicUrl(uploadData.path);

            if (urlError) {
                throw new Error(`Erreur de récupération de l'URL : ${urlError.message}`);
            }

            const fileUrl = urlData.publicUrl;
            console.log(uploadData);
            console.log(urlData);
            console.log(fileUrl);
            const { data: insertedData, error: insertError } = await supabase.from('recrutement').insert([
                {
                    name: values.name,
                    email: values.email,
                    phone: values.phone,
                    experience: values.experience,
                    education: values.education,
                    resume: fileUrl
                }
            ]);

            if (insertError) {
                throw new Error(`Erreur d'insertion : ${insertError.message}`);
            }

            console.log('Les données du formulaire ont été insérées avec succès :', insertedData);
            Swal.fire({
                title: 'Succès !',
                text: 'Vos données ont été soumises avec succès.',
                icon: 'success',
                timer: 3000,
                showConfirmButton: false,
                showClass: {
                    popup: `
                        animate__animated
                        animate__fadeInUp
                        animate__faster
                        `
                },
                hideClass: {
                    popup: `
                        animate__animated
                        animate__fadeOutDown
                        animate__faster
                        `
                }
            });
            resetForm();
        } catch (error) {
            Swal.fire({
                title: 'Erreur !',
                text: `Il y a eu une erreur lors de la soumission du formulaire : ${error.message}`,
                icon: 'error',
                confirmButtonText: 'OK'
            });

            console.error('Erreur lors de la soumission du formulaire :', error.message);
        }
    };

    return (
        <section className="bg-gray-100 py-12 md:py-16 lg:py-20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Rejoignez notre équipe pédagogique exceptionnelle</h2>
                        <p className="text-black-500 dark:text-black-400 max-w-md">
                            Nous recherchons des enseignants passionnés et dévoués pour rejoindre notre communauté scolaire dynamique. Si vous avez une passion pour l'éducation et un engagement envers la réussite des élèves, nous vous encourageons à postuler.
                        </p>
                        <p className="text-black-500 dark:text-black-400 max-w-md">
                            Notre école offre un environnement de soutien, une rémunération compétitive et des opportunités de croissance professionnelle. Nous accueillons les candidats avec des parcours et des expériences diversifiés.
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
                        <h3 className="text-2xl font-bold mb-4">Postulez maintenant</h3>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ setFieldValue, errors, touched }) => (
                                <Form className="space-y-4">
                                    <div>
                                        <label htmlFor="name" className="block text-black-700 dark:text-black-300 font-medium mb-1">Nom complet</label>
                                        <Field
                                            type="text"
                                            id="name"
                                            name="name"
                                            placeholder="Entrez votre nom"
                                            className={`w-full px-4 py-2 border border-gray-200 border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-800 ${errors.name && touched.name ? 'border-red-500' : ''}`}
                                        />
                                        <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-black-700 dark:text-black-300 font-medium mb-1">Email</label>
                                        <Field
                                            type="email"
                                            id="email"
                                            name="email"
                                            placeholder="Entrez votre email"
                                            className={`w-full px-4 py-2 border border-gray-200 border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-800 ${errors.email && touched.email ? 'border-red-500' : ''}`}
                                        />
                                        <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                                    </div>
                                    <div>
                                        <label htmlFor="phone" className="block text-black-700 dark:text-black-300 font-medium mb-1">Numéro de téléphone</label>
                                        <Field
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            placeholder="Entrez votre numéro de téléphone"
                                            className={`w-full px-4 py-2 border border-gray-200 border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-800 ${errors.phone && touched.phone ? 'border-red-500' : ''}`}
                                        />
                                        <ErrorMessage name="phone" component="div" className="text-red-500 text-sm" />
                                    </div>
                                    <div>
                                        <label htmlFor="experience" className="block text-black-700 dark:text-black-300 font-medium mb-1">Expérience d'enseignement</label>
                                        <Field
                                            as="textarea"
                                            id="experience"
                                            name="experience"
                                            placeholder="Décrivez votre expérience d'enseignement"
                                            className={`w-full px-4 py-2 border border-gray-200 border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-800 ${errors.experience && touched.experience ? 'border-red-500' : ''}`}
                                        />
                                        <ErrorMessage name="experience" component="div" className="text-red-500 text-sm" />
                                    </div>
                                    <div>
                                        <label htmlFor="education" className="block text-black-700 dark:text-black-300 font-medium mb-1">Éducation</label>
                                        <Field
                                            as="textarea"
                                            id="education"
                                            name="education"
                                            placeholder="Décrivez votre parcours éducatif"
                                            className={`w-full px-4 py-2 border border-gray-200 border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-800 ${errors.education && touched.education ? 'border-red-500' : ''}`}
                                        />
                                        <ErrorMessage name="education" component="div" className="text-red-500 text-sm" />
                                    </div>
                                    <div>
                                        <label htmlFor="resume" className="block text-black-700 dark:text-black-300 font-medium mb-1">Télécharger le CV</label>
                                        <input
                                            type="file"
                                            id="resume"
                                            name="resume"
                                            onChange={(event) => setFieldValue('resume', event.currentTarget.files[0])}
                                            className={`w-full px-4 py-2 border border-gray-200 border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-800 ${errors.resume && touched.resume ? 'border-red-500' : ''}`}
                                        />
                                        <ErrorMessage name="resume" component="div" className="text-red-500 text-sm" />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                    >
                                        Envoyer la candidature
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </section>
    );
}
