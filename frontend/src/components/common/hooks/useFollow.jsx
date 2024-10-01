import { useMutation,useQuery, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "react-hot-toast";

const useFollow=()=>{

    const queryClient=useQueryClient();

    const {mutate:follow,isPending}=useMutation({
        mutationFn:async(userId)=>{
            try {
                const res=await fetch(`/api/users/follow/${userId}`,{
                    method:"Post",
                });

                const data=res.json();
                if(!res.ok)
                    throw new Error(data.error || "Something went wrong ");
                return data;


            } catch (error) {
				throw new Error(error);
            }
        },
        onSuccess:()=>{
            Promise.all([
                queryClient.invalidateQueries({queryKey:["suggestedUsers"]}),
                queryClient.invalidateQueries({queryKey:["authUser"]}),
            ])
        },
        onError:(error)=>{
            toast.error(error.message);
        }
    });

    return {follow,isPending};
}

export default useFollow;