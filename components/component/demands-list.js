"use client";

import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useEffect, useState } from "react";
import ReplayIcon from "@mui/icons-material/Replay";
import { LoadingList } from "./loading-list";
import Swal from "sweetalert2";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";

export const Demandes = () => {
  const [demandes, setDemandes] = useState([]);
  const [fetchTrigger, setFetchTrigger] = useState(false);
  const [Loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);

  async function handleFetchAgain() {
    setLoading(true);
    setFetchTrigger(!fetchTrigger);
  }

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from("demandes")
        .select(
          "id,first_name,last_name,age, grade_level,inscrit,date_of_birth,gender"
        );
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
      text: "Supprimer la demande numéro " + demandeId,
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

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "first_name",
      headerName: "Prénom",
      width: 150,
      editable: true,
    },
    {
      field: "last_name",
      headerName: "Nom",
      width: 150,
      editable: true,
    },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      width: 110,
    },
    {
      field: "gender",
      headerName: "Genre",
      width: 110,
    },
    {
      field: "grade_level",
      headerName: "Niveau Scolaire",
      sortable: true,
      width: 130,
    },
    {
      field: "date_of_birth",
      headerName: "Date de naissance",
      sortable: true,
      width: 130,
    },
    {
      field: "inscrit",
      headerName: "status",
      sortable: true,
      width: 130,
      valueGetter: (value, row) => (row.inscrit ? "confirmée" : "en attente"),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      sortable: false,
      renderCell: ({ row }) => (
        <div className="space-x-2">
          {row.inscrit ? (
            <>
              <Link href={`/inscription/payer/${row.id}`}>
                <button
                  style={{ lineHeight: "32px" }}
                  className="px-4 bg-green-500 hover:bg-green-600 text-white rounded-md"
                >
                  Finaliser
                </button>
              </Link>
              <button
                style={{ lineHeight: "32px" }}
                onClick={() => confirmCancel(row.id)}
                className="px-4 bg-red-500 hover:bg-red-600 text-white rounded-md"
              >
                Annuler
              </button>
            </>
          ) : (
            <>
              <button
                style={{ lineHeight: "32px" }}
                onClick={() => confirmerDemande(row.id)}
                className="px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
              >
                Confirmer
              </button>
              <button
                style={{ lineHeight: "32px" }}
                onClick={() => confirmCancel(row.id)}
                className="px-4 bg-red-500 hover:bg-red-600 text-white rounded-md"
              >
                Annuler
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="px-4 mx-auto py-8">
        <div className="flex p-5">
          <h1 className="text-left text-3xl font-bold">
            Demandes d'inscription
          </h1>
          <button
            onClick={handleFetchAgain}
            className="ml-auto px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
          >
            Actualiser <ReplayIcon />
          </button>
        </div>
        {Loading ? (
          <LoadingList rowsNum={20} />
        ) : (
          <Box sx={{ height: "auto", width: "100%" }}>
            <DataGrid
              rows={demandes}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 25,
                  },
                },
              }}
              autoHeight={true}
              checkboxSelection={false}
              disableRowSelectionOnClick
            />
          </Box>
        )}
      </div>
    </>
  );
};
