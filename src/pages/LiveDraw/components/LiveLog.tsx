import { Card, CardContent, List, ListItem, ListItemText, Typography } from "@mui/material";
import type { AnyEvent } from "../types";

type Props = { events: AnyEvent[] };

export function LiveLog({ events }: Props) {
    return (
        <Card variant="outlined">
            <CardContent>
                <Typography variant="subtitle1" gutterBottom>Live log</Typography>
                <List dense>
                    {events.map((e, idx) => (
                        <ListItem key={idx}>
                            <ListItemText
                                primary={e.type}
                                secondary={<code style={{ fontSize: 12 }}>{JSON.stringify(e)}</code>}
                            />
                        </ListItem>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
}
