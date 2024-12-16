import express from 'express';
import {
    inventory
} from './inventory.js';

var router = express.Router();

router.use('/', inventory());

export function ret() {
    return router;
};