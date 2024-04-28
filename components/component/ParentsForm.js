//./components/components/ParentsForm.js

import { Field, ErrorMessage, FieldArray } from 'formik';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPhone, faEnvelope, faUsers, faHouseUser } from '@fortawesome/free-solid-svg-icons';

export function ParentsForm({ values }) {
    return (
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
                                        <label htmlFor={`parents.${index}.parentFirstName`} className="block font-medium">Nom : <span className="text-red-500">*</span></label>
                                        <div className="w-full flex items-center">
                                            <FontAwesomeIcon icon={faUser} className="mr-2 text-gray-500" />
                                            <Field name={`parents.${index}.parentFirstName`} placeholder="Nom de famille" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500" />
                                        </div>
                                        <ErrorMessage name={`parents.${index}.parentFirstName`} component="div" className="text-red-500" />
                                    </div>
                                    <div className="w-full md:w-1/2">
                                        <label htmlFor={`parents.${index}.parentLastName`} className="block font-medium">Prénom : <span className="text-red-500">*</span></label>
                                        <Field name={`parents.${index}.parentLastName`} placeholder="Prénom" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500" />
                                        <ErrorMessage name={`parents.${index}.parentLastName`} component="div" className="text-red-500" />
                                    </div>
                                </div>
                                <div className="w-full flex items-center">
                                    <div className="w-full ">
                                        <label className="block font-medium">Téléphone : <span className="text-red-500">*</span></label>
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
                                    </div>
                                </div>
                                <ErrorMessage name={`parents.${index}.phoneNumber`} component="div" className="text-red-500" />
                                <div className="w-full ">
                                    <label className="block font-medium">Email : <span className="text-red-500">*</span></label>
                                    <div className="w-full flex items-center">
                                        <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-gray-500" />
                                        <Field name={`parents.${index}.email`} placeholder="Adresse e-mail" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500" />
                                    </div>
                                </div>
                                <ErrorMessage name={`parents.${index}.email`} component="div" className="text-red-500" />
                                <div className="w-full ">
                                    <label className="block font-medium">Lien de Parenté : <span className="text-red-500">*</span></label>
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

    )
}   