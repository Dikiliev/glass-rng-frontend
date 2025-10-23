import { Box, IconButton, Link, List, ListItem, Grid, ListItemText, Tooltip, Typography } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import type { SolanaBlock } from "../../../lib/types";

type Props = {
    blocks: SolanaBlock[];
    beaconHex: string | null;
};

export function BlocksPanel({ blocks, beaconHex }: Props) {
    const copy = (t: string) => navigator.clipboard.writeText(t);

    return (
        <>
            <Typography variant="subtitle1" gutterBottom>
                1) Источник: финализированные блоки Solana
            </Typography>

            {blocks.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                    Ждём финализированные блоки…
                </Typography>
            ) : (
                <List dense>
                    {blocks.map(b => (
                        <ListItem
                            key={b.slot}
                            secondaryAction={
                                <Link href={b.explorerUrl} target="_blank" rel="noreferrer">
                                    Solscan
                                </Link>
                            }
                        >
                            <ListItemText
                                primary={`slot #${b.slot}`}
                                secondary={<code style={{ fontSize: 12 }}>{b.blockhash}</code>}
                            />
                        </ListItem>
                    ))}
                </List>
            )}

            {beaconHex && (
                <Box mt={2}>
                    <Typography variant="subtitle1" gutterBottom>
                        2) Beacon (конкатенация base58→bytes хэшей блоков)
                    </Typography>
                    <Box sx={{ fontFamily: "monospace", fontSize: 12, wordBreak: "break-all" }}>{beaconHex}</Box>
                    <Box sx={{ mt: 1 }}>
                        <Tooltip title="Скопировать beacon">
                            <IconButton size="small" onClick={() => copy(beaconHex)}>
                                <ContentCopyIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>
            )}
        </>
    );
}
