import React from "react";

export default function ConnectionStatus({ connected }) {
    let status = connected ? "Connected" : "Disconnected";
    return (
        <div className="connectionStatus">
            <strong>Status:</strong> {status}
        </div>
    );
}
