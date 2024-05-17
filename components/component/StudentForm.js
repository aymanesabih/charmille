//./components/components/ParentsForm.js

import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import 'react-phone-number-input/style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCake, faVenusMars } from '@fortawesome/free-solid-svg-icons';
import { supabase } from '../../utils/supabaseClient';



export function StudentForm({ values, setFieldValue, calculateAge, handleGradeLevelChange }) {
    return (
        <div className="flex flex-col md:flex-row justify-center md:justify-between">
            <div className="w-full md:w-1/2 mb-4 md:mr-4">
                <div className="student-section border border-gray-300 rounded-md p-4 space-y-2">
                    <h2 className="text-2xl font-bold text-center">Informations élève</h2>
                    <div className="informations">
                        <div className="space-y-2 flex flex-col md:flex-row md:space-x-4 md:space-y-0">
                            <div className="w-full md:w-1/2">
                                <label htmlFor="student-last-name" className="block font-medium">Nom de l'élève : <span className="text-red-500">*</span> </label>
                                <div className="w-full flex items-center">
                                    <FontAwesomeIcon icon={faUser} className="mr-2 text-gray-500" />
                                    <Field id="student-last-name" name="student.lastName" type="text" placeholder="Nom de famille" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"  />
                                </div>
                                <ErrorMessage name="student.lastName" component="div" className="text-red-500" />
                            </div>
                            <div className="w-full md:w-1/2">
                                <label htmlFor="student-first-name" className="block font-medium">Prénom de l'élève :<span className="text-red-500">*</span> </label>
                                <Field id="student-first-name" name="student.firstName" type="text" placeholder="Prénom" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500" />
                                <ErrorMessage name="student.firstName" component="div" className="text-red-500" />
                            </div>
                        </div>
                        <div className="space-y-2 flex flex-col md:flex-row md:space-x-4 md:space-y-0">
                            <div className="w-full md:w-1/2">
                                <label htmlFor="student-date-of-birth" className="block font-medium">Date de naissance :<span className="text-red-500">*</span> </label>
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
                                <label htmlFor="student-age" className="block font-medium">Age :<span className="text-red-500">*</span> </label>
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
                            <label htmlFor="student-gender" className="block font-medium">Sexe :<span className="text-red-500">*</span> </label>
                            <div className="w-full flex items-center place-content-center">
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
            <div className="w-full md:w-1/2 border border-gray-300 rounded-md ml-0 md:ml-4 p-4" >
                <div className="niveau">
                    <h2 className="text-2xl font-bold text-center">Informations Scolarité</h2>
                    <div className="space-y-2">
                        <label htmlFor="student-current-school-level" className="block font-medium">Niveau Scolaire Actuel : <span className="text-red-500">*</span></label>
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
                        <label htmlFor="student-grade" className="block font-medium">Niveau Scolaire Souhaité : <span className="text-red-500">*</span></label>
                        <Field id="student-grade"
                            name="student.gradeLevel"
                            as="select" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                            onChange={(event) => {
                                const grade = event.target.value;
                                handleGradeLevelChange(grade)
                                // console.log(grade);
                                setFieldValue('student.gradeLevel', grade);
                            }}>
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
    );
}