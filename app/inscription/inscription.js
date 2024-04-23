"use client";

import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { supabase } from '../../utils/supabaseClient';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPhone, faEnvelope, faUsers, faCake, faVenusMars, faHouseUser } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

export function Inscription() {
    const initialValues = {
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

    const validationSchema = Yup.object({
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

    const handleSubmit = async (values, { resetForm }) => {
        try {
            const { data: studentData, error: studentError } = await supabase.from('demandes').insert([
                {
                    first_name: values.student.firstName,
                    last_name: values.student.lastName,
                    date_of_birth: values.student.dateOfBirth,
                    gender: values.student.gender,
                    age: parseInt(values.student.age),
                    grade_level: values.student.gradeLevel,
                    current_school_level: values.student.currentSchoolLevel,
                    current_establishment: values.student.currentEstablishment,
                    inscrit: false
                }
            ]);
            if (studentError) {
                throw studentError;
            }

            const { data: fetchedStudentData, error: fetchStudentError } = await supabase
                .from('demandes')
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

            toast.success('Student information submitted successfully!');
            resetForm();
        } catch (error) {
            console.error('Error adding student:', error.message);
            toast.error('An error occurred while submitting student information.');
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
        <div className="mx-auto max-w-max space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold">Inscription élève</h1>
                <p className="text-gray-500 dark:text-gray-400">Veuillez remplir le formulaire afin d'être contacté par l'administration</p>
            </div>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, setFieldValue }) => (
                    <Form className="space-y-4">
                        <div className="flex justify-between">
                            <div className="w-1/2 mr-4">
                                <div className="student-section border border-gray-300 rounded-md p-4 space-y-2">
                                    <h2 className="text-2xl font-bold text-center">Informations élève</h2>
                                    <div className="informations">
                                        <div className="space-y-2 flex flex-col md:flex-row md:space-x-4 md:space-y-0">
                                            <div className="w-full md:w-1/2">
                                                <label htmlFor="student-last-name" className="block font-medium">Nom de l'élève :</label>
                                                <div className="w-full flex items-center">
                                                    <FontAwesomeIcon icon={faUser} className="mr-2 text-gray-500" />
                                                    <Field id="student-last-name" name="student.lastName" type="text" placeholder="Nom de famille" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500" />
                                                </div>
                                                <ErrorMessage name="student.lastName" component="div" className="text-red-500" />
                                            </div>
                                            <div className="w-full md:w-1/2">
                                                <label htmlFor="student-first-name" className="block font-medium">Prénom de l'élève :</label>
                                                <Field id="student-first-name" name="student.firstName" type="text" placeholder="Prénom" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500" />
                                                <ErrorMessage name="student.firstName" component="div" className="text-red-500" />
                                            </div>
                                        </div>
                                        <div className="space-y-2 flex flex-col md:flex-row md:space-x-4 md:space-y-0">
                                            <div className="w-full md:w-1/2">
                                                <label htmlFor="student-date-of-birth" className="block font-medium">Date de naissance :</label>
                                                <div className="w-full flex items-center">
                                                    <FontAwesomeIcon icon={faCake} className="mr-2 text-gray-500" />
                                                    <Field
                                                        id="student-date-of-birth"
                                                        name="student.dateOfBirth"
                                                        type="date"
                                                        onChange={(e) => {
                                                            const birthdate = e.target.value;
                                                            const age = calculateAge(birthdate);
                                                            setFieldValue('student.dateOfBirth', birthdate);
                                                            setFieldValue('student.age', age);
                                                        }}
                                                        value={values.student.dateOfBirth}
                                                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                                    />
                                                </div>
                                                <ErrorMessage name="student.dateOfBirth" component="div" className="text-red-500" />
                                            </div>
                                            <div className="w-full md:w-1/2">
                                                <label htmlFor="student-age" className="block font-medium">Age :</label>
                                                <Field
                                                    id="student-age"
                                                    name="student.age"
                                                    type="number"
                                                    placeholder="Age"
                                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                                    disabled
                                                />
                                                <ErrorMessage name="student.age" component="div" className="text-red-500" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="student-gender" className="block font-medium">Sexe :</label>
                                            <div className="w-full flex items-center">
                                                <FontAwesomeIcon icon={faVenusMars} className="mr-2 text-gray-500" />
                                                <div role="group" aria-labelledby="my-radio-group" className="space-y-2">
                                                    <label className="inline-flex items-center mr-4">
                                                        <Field type="radio" name="student.gender" value="male" className="form-radio" />
                                                        <span className="ml-2">Masculin</span>
                                                    </label>
                                                    <label className="inline-flex items-center">
                                                        <Field type="radio" name="student.gender" value="female" className="form-radio" />
                                                        <span className="ml-2">Féminin</span>
                                                    </label>
                                                </div>
                                            </div>
                                            <ErrorMessage name="student.gender" component="div" className="text-red-500" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-1/2 ml-4 border border-gray-300 rounded-md p-4 pl-4">
                                <div className="niveau">
                                    <h2 className="text-2xl font-bold text-center">Informations Scolarité</h2>
                                    <div className="space-y-2">
                                        <label htmlFor="student-current-school-level" className="block font-medium">Niveau Scolaire Actuel :</label>
                                        <Field id="student-current-school-level" name="student.currentSchoolLevel" as="select" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500">
                                            <option value="">Sélectionner le Niveau Scolaire Actuel </option>
                                            <option value="Creshe">Creshe</option>
                                            <option value="Petite Section">Petite Section</option>
                                            <option value="Moyenne Section">Moyenne Section</option>
                                            <option value="Grande Section">Grande Section</option>
                                            <option value="CP">CP</option>
                                            <option value="CE1">CE1</option>
                                            <option value="CE2">CE2</option>
                                            <option value="CM1">CM1</option>
                                            <option value="CM2">CM2</option>
                                            <option value="6EP">6EP</option>
                                        </Field>
                                        <ErrorMessage name="student.currentSchoolLevel" component="div" className="text-red-500" />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="student-current-establishment" className="block font-medium">Etablissement Actuel :</label>
                                        <Field id="student-current-establishment" name="student.currentEstablishment" type="text" placeholder="Etablissement Actuel" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500" />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="student-grade" className="block font-medium">Niveau Scolaire Souhaité :</label>
                                        <Field id="student-grade" name="student.gradeLevel" as="select" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500">
                                            <option value="">Sélectionner le Niveau</option>
                                            <option value="Creshe">Creshe</option>
                                            <option value="Petite Section">Petite Section</option>
                                            <option value="Moyenne Section">Moyenne Section</option>
                                            <option value="Grande Section">Grande Section</option>
                                            <option value="CP">CP</option>
                                            <option value="CE1">CE1</option>
                                            <option value="CE2">CE2</option>
                                            <option value="CM1">CM1</option>
                                            <option value="CM2">CM2</option>
                                            <option value="6EP">6EP</option>
                                        </Field>
                                        <ErrorMessage name="student.gradeLevel" component="div" className="text-red-500" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="parents-section border border-gray-300 rounded-md p-4 space-y-4">
                            <div className="w-full flex items-center justify-center	">
                                <FontAwesomeIcon icon={faUsers} className="mr-2 text-gray-500" />
                                <h2 className="text-2xl font-bold text-center">Parents</h2>
                            </div>
                            <FieldArray name="parents">
                                {({ push, remove }) => (
                                    <div>
                                        {values.parents.map((_, index) => (
                                            <div key={index} className="space-y-2">
                                                <div className="font-medium">Responsable {index + 1}</div>
                                                <div className="flex flex-col md:flex-row md:space-x-4 md:space-y-0">
                                                    <div className="w-full md:w-1/2">
                                                        <label htmlFor={`parents.${index}.parentFirstName`} className="block font-medium">Nom :</label>
                                                        <div className="w-full flex items-center">
                                                            <FontAwesomeIcon icon={faUser} className="mr-2 text-gray-500" />
                                                            <Field name={`parents.${index}.parentFirstName`} placeholder="Nom de famille" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500" />
                                                        </div>
                                                        <ErrorMessage name={`parents.${index}.parentFirstName`} component="div" className="text-red-500" />
                                                    </div>
                                                    <div className="w-full md:w-1/2">
                                                        <label htmlFor={`parents.${index}.parentLastName`} className="block font-medium">Prénom :</label>
                                                        <Field name={`parents.${index}.parentLastName`} placeholder="Prénom" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500" />
                                                        <ErrorMessage name={`parents.${index}.parentLastName`} component="div" className="text-red-500" />
                                                    </div>
                                                </div>
                                                <div className="w-full flex items-center">
                                                    <FontAwesomeIcon icon={faPhone} className="mr-2 text-gray-500" />
                                                    <Field name={`parents.${index}.phoneNumber`}>
                                                        {({ field, form }) => (
                                                            <PhoneInput
                                                                {...field}
                                                                placeholder="Téléphone Mobile"
                                                                defaultCountry="MA"
                                                                onChange={(value) => form.setFieldValue(field.name, value)}
                                                                onBlur={field.onBlur}
                                                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                                            />
                                                        )}
                                                    </Field>
                                                </div>
                                                <ErrorMessage name={`parents.${index}.phoneNumber`} component="div" className="text-red-500" />
                                                <div className="w-full flex items-center">
                                                    <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-gray-500" />
                                                    <Field name={`parents.${index}.email`} placeholder="Adresse e-mail" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500" />
                                                </div>
                                                <ErrorMessage name={`parents.${index}.email`} component="div" className="text-red-500" />
                                                <div className="w-full flex items-center">
                                                    <FontAwesomeIcon icon={faHouseUser} className="mr-2 text-gray-500" />
                                                    <Field name={`parents.${index}.relationship`} as="select" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500">
                                                        <option value="">Selectionner la Relation de Parenté</option>
                                                        <option value="Père">Père</option>
                                                        <option value="Mère">Mère</option>
                                                        <option value="Beau-père">Beau-père</option>
                                                        <option value="Belle-mère">Belle-mère</option>
                                                        <option value="Grand-père">Grand-père</option>
                                                        <option value="Grande-mère">Grande-mère</option>
                                                        <option value="Frère">Frère</option>
                                                        <option value="Soeur">Soeur</option>
                                                        <option value="Oncle">Oncle</option>
                                                        <option value="Tante">Tante</option>
                                                        <option value="Cousin">Cousin</option>
                                                        <option value="Tuteur">Tuteur</option>
                                                        <option value="Non défini">Non défini</option>
                                                    </Field>
                                                </div>
                                                <ErrorMessage name={`parents.${index}.relationship`} component="div" className="text-red-500" />
                                                {index > 0 && (
                                                    <button type="button" onClick={() => remove(index)} className="mt-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md">Supprimer Responsable</button>
                                                )}
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => push({ parentFirstName: '', parentLastName: '', phoneNumber: '', email: '', relationship: '' })} className="mt-4 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md">Ajouter Responsable</button>
                                    </div>
                                )}
                            </FieldArray>
                        </div>

                        <div className="text-center">
                            <button type="submit" className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md">Soumettre</button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default Inscription;
