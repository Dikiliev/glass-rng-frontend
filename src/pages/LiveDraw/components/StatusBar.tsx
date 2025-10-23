import {Alert, Chip, Stack, Typography} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

type Props = {
    status: "waiting"|"committed"|"finalized"|"mixing"|"done";
    inputs: string[];
    statusNote: string | null;
    collectOpen?: boolean;
    collectRemainMs?: number | null;
};

export function StatusBar({ status, inputs, statusNote, collectOpen, collectRemainMs }: Props) {
    const chip =
        status === "done" ? (
            <Chip color="success" icon={<CheckCircleIcon />} label="Done" />
        ) : status === "mixing" ? (
            <Chip color="warning" icon={<AutoAwesomeIcon />} label="Mixing..." />
        ) : status === "finalized" ? (
            <Chip color="info" label="Blocks finalized" />
        ) : status === "committed" ? (
            <Chip label="Committed" />
        ) : (
            <Chip icon={<HourglassEmptyIcon />} label="Waiting..." />
        );

    return (
        <>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="h6">Status</Typography>
                {chip}
                {!!inputs.length && (
                    <Stack direction="row" spacing={1} sx={{ ml: 2 }}>
                        {inputs.map(s => (
                            <Chip key={s} size="small" label={`src:${s}`} />
                        ))}
                    </Stack>
                )}
            </Stack>
            {statusNote && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {statusNote}
                </Typography>
            )}

            {collectOpen && (
                <Alert severity="info" sx={{ mt: 1 }}>
                    Сбор серверного шума… {collectRemainMs != null ? Math.ceil(collectRemainMs/1000) : ""} c
                </Alert>
            )}
        </>
    );
}
