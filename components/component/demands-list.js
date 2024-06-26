"use client";

import { supabase } from "../../lib/supabase";
import Link from "next/link";
import { useEffect, useState } from "react";
import ReplayIcon from "@mui/icons-material/Replay";
import { LoadingList } from "./loading-list";
import Swal from "sweetalert2";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Modal, Skeleton, Typography } from "@mui/material";
import ParentsCard from "./parents-card";

export const Demandes = () => {
  const [demandes, setDemandes] = useState([]);
  const [parents, setParents] = useState(null);
  const [fetchTrigger, setFetchTrigger] = useState(false);
  const [Loading, setLoading] = useState(true);
  const [parentLoading, setParentLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const handleOpen = (parentId) => {
    fetchParent(parentId);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setParentLoading(true);
  };

  async function handleFetchAgain() {
    setLoading(true);
    setFetchTrigger(!fetchTrigger);
  }

  useEffect(() => {
    async function fetchDemandes() {
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
    fetchDemandes();
  }, [fetchTrigger]);

  async function fetchParent(parentId) {
    const { data, error } = await supabase
      .from("parents")
      .select()
      .eq("student_id", parentId);
    setParents(data);
    setParentLoading(false);
    if (error) {
      console.error(error);
    }
    console.log("parent: ", parent);
  }

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

  const annulerDemande = async (demandeId) => {
    try {
      await supabase.from("demandes").delete().eq("id", demandeId);
    } catch (error) {
      console.error(error);
    }
    handleFetchAgain();
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "first_name",
      headerName: "Prénom",
      width: 150,
    },
    {
      field: "last_name",
      headerName: "Nom",
      width: 150,
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
      renderCell: ({ row }) => (
        <div className="space-x-2">
          {row.inscrit ? (
            <span className="px-2 py-1 rounded-full bg-green-100 text-green-800">
              Confirmée
            </span>
          ) : (
            <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
              En Attente
            </span>
          )}
        </div>
      ),
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
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box
              sx={{
                backgroundColor: "white",
                borderRadius: "8px",
                padding: "20px",
                textAlign: "center",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              {parentLoading ? (
                <Box
                  sx={{
                    height: "20rem",
                    width: "15rem",
                    backgroundColor: "white",
                    borderRadius: "8px",
                    padding: "20px",
                    textAlign: "center",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <Skeleton animation="wave" variant="text" />
                  <Skeleton animation="wave" variant="text" />
                  <Skeleton animation="wave" variant="text" />
                </Box>
              ) : (
                <ParentsCard parents={parents} />
              )}
            </Box>
          </Modal>
        </div>
        {Loading ? (
          <LoadingList rowsNum={20} />
        ) : (
          <Box sx={{ height: "auto", width: "100%", backgroundColor: "white" }}>
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
              onCellClick={(params) => {
                handleOpen(params.row.id);
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
