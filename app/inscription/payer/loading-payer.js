import Skeleton from "@mui/material/Skeleton";

export function LoadingPayer() {
    return (
        <div className="container w-3/4 mx-auto my-8 px-4 md:px-6">
            <div className="text-center">
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-blue-700">Informations de l'Étudiant</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Skeleton animation="wave" variant="text" />
                        </div>
                        <div>
                            <Skeleton animation="wave" variant="text" />
                        </div>
                        <div>
                            <Skeleton animation="wave" variant="text" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-4 text-blue-700">Détails Supplémentaires</h2>
                    <div>
                        <Skeleton animation="wave" variant="text" />
                        <Skeleton animation="wave" variant="text" />
                        <Skeleton animation="wave" variant="text" />
                        <Skeleton animation="wave" variant="text" />
                        <Skeleton animation="wave" variant="text" />
                        <Skeleton animation="wave" variant="text" />
                        <Skeleton animation="wave" variant="text" />
                    </div>
                </div>
            </div>
        </div>
    );
}
