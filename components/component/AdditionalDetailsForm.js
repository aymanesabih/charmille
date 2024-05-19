// ./components/componentAdditionalDetailsForm.js
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
// import { Button } from "@/components/ui/button";
import { Formik, Form, Field, ErrorMessage } from 'formik';


export function AdditionalDetailsForm() {
    return (
        <div>
            <div className="student-section border border-gray-300 rounded-md p-4 space-y-2">
                <h2 className="text-2xl font-bold mb-4">Détails Supplémentaires</h2>
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
                {/* <div className="bg-white rounded-lg shadow-md p-6 mt-4">
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
            </div> */}
                {/* {!isPaid && (
                <Button type="submit" variant="botonakhdra" disabled={!studentData}>
                    Finaliser Inscription
                </Button>
            )} */}
            </div>
        </div>

    );
}
