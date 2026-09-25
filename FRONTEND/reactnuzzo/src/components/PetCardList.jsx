import { Box } from '@mui/material';
import PetCard from './PetCard';

function PetCardList({ pets, onToggleFavourite, onDelete }) {
    return (
        <Box
            sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' },
            }}
        >
            {pets.map((pet) => (
                <PetCard
                    key={pet.id}
                    pet={pet}
                    onToggleFavourite={onToggleFavourite}
                    onDelete={onDelete}
                />
            ))}
        </Box>
    );
}

export default PetCardList;
