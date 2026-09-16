import { useState } from 'react';
import {
    Box, TextField, InputAdornment, FormControl, InputLabel, Select,
    MenuItem, Button, Collapse, Stack, Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import { SORT_OPTIONS, EMPTY_FILTERS } from '../utils/postFilters';
import { POST_TYPES, POST_TYPE_LABELS } from '../utils/postOptions';

function PostFilters({ value, onChange }) {
    const [showAdvanced, setShowAdvanced] = useState(false);

    function update(field, fieldValue) {
        onChange({ ...value, [field]: fieldValue });
    }

    function clearAll() {
        onChange({ ...EMPTY_FILTERS });
    }

    return (
        <Box sx={{ mb: 3 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ alignItems: { sm: 'center' } }}>
                <TextField
                    placeholder="Search for title or category..."
                    fullWidth
                    size="small"
                    value={value.search}
                    onChange={(e) => update('search', e.target.value)}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" />
                                </InputAdornment>
                            ),
                        },
                    }}
                />

                <FormControl size="small" sx={{ minWidth: 220 }}>
                    <InputLabel id="sort-label">Sort by</InputLabel>
                    <Select
                        labelId="sort-label"
                        label="Sort by"
                        value={value.sortBy}
                        onChange={(e) => update('sortBy', e.target.value)}
                    >
                        {SORT_OPTIONS.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Button
                    variant={showAdvanced ? 'contained' : 'outlined'}
                    startIcon={<TuneIcon />}
                    onClick={() => setShowAdvanced((prev) => !prev)}
                    sx={{ flexShrink: 0 }}
                >
                    Filters
                </Button>
            </Stack>

            <Collapse in={showAdvanced}>
                <Box sx={{ mt: 2 }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>
                        <FormControl size="small" sx={{ minWidth: 160 }}>
                            <InputLabel id="filter-type-label">Type</InputLabel>
                            <Select
                                labelId="filter-type-label"
                                label="Type"
                                value={value.type}
                                onChange={(e) => update('type', e.target.value)}
                            >
                                <MenuItem value="">Any type</MenuItem>
                                {Object.values(POST_TYPES).map((t) => (
                                    <MenuItem key={t} value={t}>{POST_TYPE_LABELS[t]}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Box>
                            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                                Price (€)
                            </Typography>
                            <Stack direction="row" spacing={1}>
                                <TextField
                                    label="Min" type="number" size="small" sx={{ width: 90 }}
                                    value={value.priceMin} onChange={(e) => update('priceMin', e.target.value)}
                                    slotProps={{ htmlInput: { min: 0 } }}
                                />
                                <TextField
                                    label="Max" type="number" size="small" sx={{ width: 90 }}
                                    value={value.priceMax} onChange={(e) => update('priceMax', e.target.value)}
                                    slotProps={{ htmlInput: { min: 0 } }}
                                />
                            </Stack>
                        </Box>

                        <Box>
                            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                                Views
                            </Typography>
                            <Stack direction="row" spacing={1}>
                                <TextField
                                    label="Min" type="number" size="small" sx={{ width: 90 }}
                                    value={value.viewsMin} onChange={(e) => update('viewsMin', e.target.value)}
                                    slotProps={{ htmlInput: { min: 0 } }}
                                />
                                <TextField
                                    label="Max" type="number" size="small" sx={{ width: 90 }}
                                    value={value.viewsMax} onChange={(e) => update('viewsMax', e.target.value)}
                                    slotProps={{ htmlInput: { min: 0 } }}
                                />
                            </Stack>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', pt: { md: 2.5 } }}>
                            <Button onClick={clearAll} color="inherit">Undo filters</Button>
                        </Box>
                    </Stack>
                </Box>
            </Collapse>
        </Box>
    );
}

export default PostFilters;
