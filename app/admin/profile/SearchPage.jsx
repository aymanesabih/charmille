"use client"
import { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabaseClient';
import Swal from 'sweetalert2';
import 'animate.css';

export function SearchPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [price, setPrice] = useState(null);
    const [isPaid, setIsPaid] = useState({}); // Changed to object to hold payment status for each month
    const [error, setError] = useState(null);
    const [photoURL, setPhotoURL] = useState(null);


    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!searchQuery.trim()) {
                setSearchResults([]);
                return;
            }

            setLoading(true);

            const { data, error } = await supabase
                .from('students')
                .select('*')
                .ilike('last_name', `%${searchQuery}%`);

            setLoading(false);

            if (error) {
                console.error('Error fetching students:', error.message);
                return;
            }

            setSearchResults(data);
        };

        fetchSearchResults();
    }, [searchQuery]);

    const handleChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleClick = (studentId) => {
        const selectedStudent = searchResults.find((student) => student.id === studentId);
        setSelectedStudent(selectedStudent);
        setSearchQuery('');

    };
    const handlePhotoUpload = async (file) => {
        try {
            const { data, error } = await supabase.storage
                .from('student_photos')
                .upload(`student_photos/${selectedStudent.id}`, file, {
                    cacheControl: '3600',
                    upsert: false,
                });

            if (error) {
                throw error;
            }

            const photoURL = `https://doqgfvlrcmvyhjaksyml.supabase.co/storage/v1/object/public/student_photos/student_photos/${selectedStudent.id}`;
            setPhotoURL(photoURL);
            console.log(photoURL);
            if (photoURL) {
                await supabase
                    .from("students")
                    .update({ photo: photoURL })
                    .eq("id", selectedStudent.id);
                    console.log('done');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        async function fetchPrice() {
            try {
                const { data, error } = await supabase
                    .from('settings')
                    .select(selectedStudent.grade_level)
                    .eq('name', 'frais_mensuel')
                    .single();

                if (error) {
                    throw error;
                }
                const sanitizedGrade = selectedStudent.grade_level.replace(/\s+/g, '');
                setPrice(data[sanitizedGrade]);
            } catch (error) {
                setError(error.message);
            }
        }

        if (selectedStudent) {
            fetchPrice();
        }
    }, [selectedStudent]);

    useEffect(() => {
        async function fetchIsPaid() {
            try {
                const { data, error } = await supabase
                    .from('payment')
                    .select('*')
                    .eq('student_id', selectedStudent.id)
                    .single();

                if (error) {
                    throw error;
                }

                setIsPaid(data);
            } catch (error) {
                setError(error.message);
            }
        }

        if (selectedStudent) {
            fetchIsPaid();
        }
    }, [selectedStudent]);

    const handlePaymentToggle = async (month) => {
        if (!selectedStudent) return;

        try {
            console.log(selectedStudent.first_name, selectedStudent.last_name, selectedStudent.grade_level)
            const confirmed = await Swal.fire({
                title: 'Êtes-vous sûr?',
                text: `Voulez-vous confirmer le payement du mois ${month}? - Montant : ${price} DH`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Confirmer',
                cancelButtonText: 'Anuler',
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

            if (confirmed.isConfirmed) {
                const { error } = await supabase
                    .from('payment')
                    .update({ [month]: price })
                    .eq('student_id', selectedStudent.id);

                if (error) {
                    console.error('Error updating payment status:', error.message);
                } else {
                    setIsPaid(prevIsPaid => ({
                        ...prevIsPaid,
                        [month]: true
                    }));

                    Swal.fire({
                        icon: 'success',
                        title: 'Opération effectuée',
                        text: 'Payement inséré avec succès',
                        confirmButtonColor: '#3085d6',
                    });
                    // Pass firstName, lastName, gradeLevel along with month and price
                    printReceipt(selectedStudent.first_name, selectedStudent.last_name, selectedStudent.grade_level, month, price);
                }
            }
        } catch (error) {
            console.error('Error updating payment status:', error.message);
        }
    };
    const handlePaymentCancel = async (month) => {
        if (!selectedStudent) return;

        try {
            const confirmed = await Swal.fire({
                title: 'Êtes-vous sûr?',
                text: `Voulez-vous confirmer l'annulation du payement du mois ${month}?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Confirmer',
                cancelButtonText: 'Anuler'
            });

            if (confirmed.isConfirmed) {
                const { error } = await supabase
                    .from('payment')
                    .update({ [month]: null })
                    .eq('student_id', selectedStudent.id);

                if (error) {
                    console.error('Error cancelling payment:', error.message);
                } else {
                    setIsPaid(prevIsPaid => ({
                        ...prevIsPaid,
                        [month]: false
                    }));

                    Swal.fire({
                        icon: 'success',
                        title: 'Opération effectuée',
                        text: 'Payement annulé avec succès',
                        confirmButtonColor: '#3085d6',
                    });

                }
            }
        } catch (error) {
            console.error('Error cancelling payment:', error.message);
        }
    };

    const printReceipt = (firstName, lastName, gradeLevel, month, price) => {
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
            <td><strong>Mois:</strong></td>
            <td>${month}</td>
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
    const handlePriceUpdate = async () => {
        const { value: newPrice } = await Swal.fire({
            title: 'Modifier le Prix',
            input: 'number',
            inputLabel: 'Nouveau Prix (DH)',
            inputPlaceholder: 'Entrez le nouveau prix',
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value || isNaN(value)) {
                    return 'Veuillez entrer un prix valide.';
                }
            }
        });

        if (newPrice) {
            setPrice(parseFloat(newPrice));
            Swal.fire({
                icon: 'success',
                title: 'Prix mis à jour!',
                text: `Nouveau prix : ${newPrice} DH`,
                confirmButtonColor: '#3085d6',
            });
        }
    };


    return (
        <div className="container mx-auto mt-20">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Search Students</h1>
                <input
                    id="s"
                    type="search"
                    value={searchQuery}
                    onChange={handleChange}
                    placeholder="Search by name..."
                    style={{
                        background: 'rgba(0, 0, 0, 0.375) url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAUCAYAAABvVQZ0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQBJREFUeNqslI0RgyAMhdENWIEVWMEVXIGO0BW6Ah2hHcGOoCPYEewINFzBe9IA9id37w4kfEZesHHOCSYUqSPJML+RJlELDwN1pMHxMZNMkr8RTgyz2YPH5LmtwXpIHkOFmKhIlxowDmYAycKnHAHYcTCsSpXOJCie6YWDnXKLGeHLN2stGaqDsXXrX3GFcYcLrfhjtKEhffQ792gYT2nT6pJDjCw4z7ZGdGipOIqNbXIwFUARmCbKpMfYxsWJBmCEDoW7+gYUTAU2s3HJrK3AJvMLkqGHFLgWXTckm+SfSQexs+tLRqwVfgvjgMsvMAT689S5M/sk/I14kO5PAQYAuk6L1q+EdHMAAAAASUVORK5CYII=) no-repeat 14px 14px',
                        textIndent: '1em',
                        display: 'inline-block',
                        border: '0 none',
                        width: '0',
                        height: '3em',
                        borderRadius: '3em',
                        transition: '0.3s',
                        outline: 'none',
                        padding: '1em 1.5em',
                        cursor: 'pointer',
                        WebkitAppearance: 'none',
                        fontWeight: 'inherit',
                        fontSize: 'inherit',
                        fontFamily: 'inherit',
                        color: '#999',
                        verticalAlign: 'baseline',
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.background = '#fff url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAUCAYAAABvVQZ0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAT5JREFUeNqsVLtOw0AQtIMlRJHCEhUVMg398QEUSZnSfILzCXxDPsFu6XAJHWnTcS1lWsprKdmLxtKwvjVBYaTV7cm+udnX5fPb+yyBSmwhVmK/FfPZLyjUPhI8YtXYi23EOovs7PzyevAbsWeoGg5HNUHsCipX8F9TZDOstVgLPxIsxW6w3sHv6dJ2StkLbh6IPtR/AWRfSIET20H9D2U1hfaAgxY2KMagcBSmg9/rmwx0lBqTzGfHoVfVHxXgXzCjHNRHnnHke4vMGc2q0RBR0GSeCLlpLaJGFWKUszVuib32nih7iTFrjXAPyGnQ48c3Gu5AOVlMtMk6NZuf+FiC+AIhV0T+pBQ5ntXceIJKqKko2duJ2TwoLAz5QTVnagJaXWEO8y/wSMuKH9RTJoCTHyNZFidOUEfNu/8WYAAOXUT04MOtlwAAAABJRU5ErkJggg==) 14px 14px no-repeat';
                        e.target.style.width = '50%';
                        e.target.style.cursor = 'text';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(0, 0, 0, 0.375) url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAUCAYAAABvVQZ0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQBJREFUeNqslI0RgyAMhdENWIEVWMEVXIGO0BW6Ah2hHcGOoCPYEewINFzBe9IA9id37w4kfEZesHHOCSYUqSPJML+RJlELDwN1pMHxMZNMkr8RTgyz2YPH5LmtwXpIHkOFmKhIlxowDmYAycKnHAHYcTCsSpXOJCie6YWDnXKLGeHLN2stGaqDsXXrX3GFcYcLrfhjtKEhffQ792gYT2nT6pJDjCw4z7ZGdGipOIqNbXIwFUARmCbKpMfYxsWJBmCEDoW7+gYUTAU2s3HJrK3AJvMLkqGHFLgWXTckm+SfSQexs+tLRqwVfgvjgMsvMAT689S5M/sk/I14kO5PAQYAuk6L1q+EdHMAAAAASUVORK5CYII=) no-repeat 14px 14px';
                        e.target.style.width = '0';
                        e.target.style.cursor = 'pointer';
                    }}
                />
            </div>
            {loading && <p className="text-center mt-4">Loading...</p>}
            <div className="mt-8 mb-8">
                {searchResults.map((student) => (
                    <div
                        key={student.id}
                        onClick={() => handleClick(student.id)}
                        className="w-1/2 text-center border border-gray-300 rounded-md p-4 cursor-pointer m-auto mb-2"
                    >
                        <h2 className="text-lg font-bold mb-2">
                            {student.first_name} {student.last_name} - <span>{student.grade_level}</span>
                        </h2>
                    </div>
                ))}
            </div>
            {selectedStudent && (
                <div className="text-center">
                    <h2 className="text-xl font-bold mb-2">
                        {selectedStudent.first_name} {selectedStudent.last_name}
                    </h2>
                    {selectedStudent.photo ? (
                        <img
                            src={selectedStudent.photo}
                            alt="Student"
                            className="mx-auto mb-4"
                            style={{ width: '200px', height: '200px', borderRadius: '50%' }}
                        />
                    ) : (
                        <div className="mx-auto mb-4">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handlePhotoUpload(e.target.files[0])}
                            />
                        </div>
                    )}
                    <p><strong>Date of Birth:</strong> {selectedStudent.date_of_birth}</p>
                    <p><strong>Gender:</strong> {selectedStudent.gender}</p>
                    <p><strong>Grade Level:</strong> {selectedStudent.grade_level}</p>
                    <p><strong>Current School Level:</strong> {selectedStudent.current_school_level}</p>
                    <p><strong>Current Establishment:</strong> {selectedStudent.current_establishment}</p>
                    <p><strong>Address:</strong> {selectedStudent.address}</p>
                    <p><strong>Blood Type:</strong> {selectedStudent.bloodtype}</p>
                    <p><strong>Allergies:</strong> {selectedStudent.allergies}</p>
                    <p><strong>Medical Conditions:</strong> {selectedStudent.medical_conditions}</p>
                    <div className="text-center">
                        <h1 className='m-4 text-4xl text-blue-800 font-bold'>Paiement</h1>
                        <p>
                            <strong>Montant : </strong>
                            <span className='font-medium text-green-500 font-bold'>{price} DH</span>
                        </p>
                        <div className="flex justify-center items-center space-x-4">
                            <div>
                                <button
                                    onClick={handlePriceUpdate}
                                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                                >
                                    Modifier le Prix
                                </button>
                            </div>
                        </div>
                    </div>


                    <div className="flex justify-center items-center space-x-4 flex-wrap">
                        {[9, 10, 11, 12, 1, 2, 3, 4, 5, 6].map((month) => (
                            <div key={month} className="flex flex-col items-center mb-4">
                                <div className="bg-gray-200 p-4 rounded-md">
                                    <h3 className="text-lg font-semibold">Month {month}</h3>
                                    <p className={isPaid[month] ? 'font-medium text-green-500 font-bold' : 'font-medium text-red-500 font-bold'}>
                                        {isPaid[month] ? 'Payé' : 'Non Payé'}
                                    </p>
                                    {isPaid[month] && (
                                        <p className='font-medium text-purple-500 font-bold'>
                                            {isPaid[month]} DH
                                        </p>
                                    )}
                                </div>
                                {!isPaid[month] && (
                                    <button
                                        onClick={() => handlePaymentToggle(month)}
                                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                                    >
                                        Pay
                                    </button>
                                )}
                                {isPaid[month] && (
                                    <button
                                        onClick={() => handlePaymentCancel(month)}
                                        className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600"
                                    >
                                        Annuler
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}