import React from "react";
import TicketForm from "../components/TicketForm";
import TicketList from "../components/TicketList";

export default function DashboardClient() {
  return (
    <div>
      <TicketForm />
      <TicketList />
    </div>
  );
}
