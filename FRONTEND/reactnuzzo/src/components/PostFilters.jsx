// filtragem toda feita em be, fe so guarda as escolhas do user


import { useState } from 'react';
import {
    Box, TextField, FormControl, InputLabel, Select,
    MenuItem, Button, Collapse, Stack, Typography,
} from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import { SORT_OPTIONS, EMPTY_FILTERS } from '../utils/postFilters';
import { POST_TYPES, POST_TYPE_LABELS, POST_CATEGORIES } from '../utils/postOptions';

function PostFilters({ value, onChange }) {
    const [showAdvanced, setShowAdvanced] = useState(false);

    function update(field, fieldValue) {
        onChange({ ...value, [field]: fieldValue });
    }

    return (
        <Box sx={{ mb: 3 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ alignItems: { sm: 'center' } }}>
                <FormControl size="small" fullWidth>
                    <InputLabel id="filter-category-label">Category</InputLabel>
                    <Select
                        labelId="filter-category-label"
                        label="Category"
                        value={value.category}
                        onChange={(e) => update('category', e.target.value)}
                    >
                        <MenuItem value="">All categories</MenuItem>
                        {POST_CATEGORIES.map((category) => (
                            <MenuItem key={category} value={category}>{category}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

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
                        <Button onClick={() => onChange({ ...EMPTY_FILTERS })} color="inherit">Clear filters</Button>
                    </Box>
                </Stack>
            </Collapse>
        </Box>
    );
}

export default PostFilters;