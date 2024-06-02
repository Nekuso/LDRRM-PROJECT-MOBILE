import { createClient } from "@supabase/supabase-js";
import { useState } from "react";

type RequestProps = {
  requester_first_name: string | null;
  requester_last_name: string | null;
  requester_contact_number: string | null;
  coordinates: string;
  mobile_user_id: string; // Assuming mobile_user_id is a string, adjust as needed
};

export const useRequests: any = () => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
  );
  const [requestsData, setRequestsData] = useState<any>([]);
  const [currentRequestData, setCurrentRequestData] = useState<any>([]);

  const createRequest = async (props: RequestProps, duration?: any) => {
    console.log("Inserting request:", props);

    try {
      const result = await supabase.from("requests").insert({
        requester_first_name: props.requester_first_name,
        requester_last_name: props.requester_last_name,
        requester_contact_number: props.requester_contact_number,
        coordinates: props.coordinates,
        mobile_user_id: props.mobile_user_id,
        status: "Ongoing",
        employees_id: null,
      });

      console.log("Insert result:", result);

      if (result.error) {
        console.error("Error inserting request:", result.error);
        return result.error;
      }

      await new Promise((resolve) => setTimeout(resolve, duration));

      return result;
    } catch (error) {
      console.error("Exception caught:", error);
    }
  };

  const getRequests = async () => {
    const { data, error } = await supabase.from("requests").select("*");

    if (error) {
      console.error("Error fetching requests:", error);
      return;
    }

    setRequestsData(data);
  };

  return {
    // states
    requestsData,
    currentRequestData,

    // methods
    createRequest,
    getRequests, // add this line
  };
};
