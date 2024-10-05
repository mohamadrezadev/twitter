import { useMutation, useQuery ,useQueryClient} from "@tanstack/react-query";
import { useState, useEffect } from "react";
import useFollow from "./hooks/useFollow";
import Following from "./Following.jsx";
const FollowingList = ({ user }) => {

  const queryClient=useQueryClient();
  const { follow, isPending } = useFollow();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Track if dialog is open
  const [hasFetched, setHasFetched] = useState(false);

  const action = "GetFollowing";
  const {
    data: UserConnections,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["UserConnections"],
    queryFn: async () => {
      try {
        const userIds = user?.following || [];
        const res = await fetch(`/api/users/connections/${action}`, {
          method: "POsT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userIds }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data;
      
      } catch (error) {
        throw new Error(error.message);
      }
    },
  });

  useEffect(() => {
    refetch();
  }, [refetch]);


  const openDialog = () => {
   setIsDialogOpen(true);
    if (!hasFetched) {
      refetch();
      setHasFetched(true); 
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
          <button
        className="text-slate-500 text-xs"
        onClick={openDialog}
      >
        Following
      </button>

      {/* <button
        className="text-slate-500 text-xs"
        onClick={() => document.getElementById("FollowingList").showModal()}
      >
        Following
      </button> */}
      <dialog id="FollowingList" className="modal"  open={isDialogOpen}>
        <div className="modal-box border rounded-md border-gray-700 shadow-md">
          {!isLoading && !isRefetching && UserConnections?.length === 0 && (
            <p className="text-center my-4">
              This user is not following anyone.👻
            </p>
          )}

          <div className="overflow-x-auto">
            <p>My following .</p>
            <table className="table">
              {UserConnections?.map((user) => (
                
                <tbody>
                  <tr  key={user.id}>
                   <Following user={user} isPending={isPending}/>
                  </tr>
                
                </tbody>
              ))}
            </table>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
        <button className="outline-none" onClick={closeDialog}>
            Close
          </button>
          {/* <button className="outline-none">close</button> */}
        </form>
      </dialog>
    </>
  );
};

export default FollowingList;
