"use client";

import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useEffect, useState } from "react";
import ReplayIcon from "@mui/icons-material/Replay";
import { LoadingList } from "./loading-list";
import Swal from "sweetalert2";

export const Demandes = () => {
  const [demandes, setDemandes] = useState([]);
  const [fetchTrigger, setFetchTrigger] = useState(false);
  const [Loading, setLoading] = useState(true);

  async function handleFetchAgain() {
    setLoading(true);
    setFetchTrigger(!fetchTrigger);
  }

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase.from("demandes").select();
      setDemandes(data);
      setLoading(false);
      if (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [fetchTrigger]);

  async function confirmerDemande(demandeId) {
    try {
      await supabase
        .from("demandes")
        .update({ inscrit: true })
        .eq("id", demandeId);
      displaySucess();
    } catch (error) {
      console.error(error);
    }

    handleFetchAgain();
  }

  const displaySucess = () => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: "success",
      title: "La demande a été confirmée",
    });
  };

  function confirmCancel(demandeId) {
    Swal.fire({
      title: "Êtes-vous sûre?",
      text: "Supprimer la demande.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirmer",
    }).then((result) => {
      if (result.isConfirmed) {
        annulerDemande(demandeId);
        Swal.fire({
          title: "Succès",
          text: "La demande a été annulée.",
          icon: "success",
        });
      }
    });
  }

  async function annulerDemande(demandeId) {
    try {
      await supabase.from("demandes").delete().eq("id", demandeId);
    } catch (error) {
      console.error(error);
    }
    handleFetchAgain();
  }

  return (
    <div className="px-4 mx-auto py-8">
      <div className="flex p-5">
        <h1 className="text-left text-3xl font-bold">Demandes d'inscription</h1>
        <button
          onClick={handleFetchAgain}
          className="ml-auto px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
        >
          Actualiser <ReplayIcon />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-3 text-left">Demande</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Loading ? (
              <LoadingList />
            ) : (
              demandes.map((demande) => (
                <tr key={demande.id} className="border-b border-gray-200">
                  <td className="px-4 py-3">
                    <div className="font-medium">
                      {demande.first_name} {demande.last_name}
                    </div>
                    <div className="text-gray-500">{demande.grade_level}</div>
                  </td>
                  <td className="px-4 py-3">
                    {demande.inscrit ? (
                      <span className="px-2 py-1 rounded-full bg-green-100 text-green-800">
                        Confirmée
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                        En Attente
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    {demande.inscrit ? (
                      <>
                        <Link
                          href={`/inscription/payer/${demande.id}`} /* route to be added later to complete inscription process for demand*/
                        >
                          <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md">
                            Finaliser
                          </button>
                        </Link>
                        <button
                          onClick={() => confirmCancel(demande.id)}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
                        >
                          Annuler
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => confirmerDemande(demande.id)}
                          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                        >
                          Confirmer
                        </button>
                        <button
                          onClick={() => confirmCancel(demande.id)}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
                        >
                          Annuler
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
