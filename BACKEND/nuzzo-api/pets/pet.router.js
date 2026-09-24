const express = require('express');
const petController = require('./pet.controller');
const { authenticate } = require('../../shared/auth-middleware');

const petRouter = express.Router();

petRouter.get('/mine', authenticate, petController.getMyPets);
petRouter.get('/:id', authenticate, petController.getPetById);

petRouter.post('/', authenticate, petController.createPet);
petRouter.put('/:id', authenticate, petController.updatePet);
petRouter.delete('/:id', authenticate, petController.deletePet);

petRouter.get('/:id/health-history', authenticate, petController.getHealthHistory);
petRouter.post('/:id/health-history', authenticate, petController.addHealthHistoryEntry);

module.exports = petRouter;
