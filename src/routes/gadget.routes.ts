import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import validate from "../middlewares/validate.middleware";
import { createGadgets, deleteGadget, destructGadget, getAllgadgets, updateGadgets } from "../controllers/gadget.controller";
import { createGadgetSchema, deleteGadgetSchema, destructGadgetSchema, getGadgetSchema, updateGadgetSchema } from "../schemas/gadget.schema";

/**
 * @swagger
 * tags:
 *   name: Gadgets
 *   description: API for managing gadgets
 *
 * /api/v1/gadgets:
 *   get:
 *     summary: Retrieve all gadgets
 *     tags: [Gadgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [AVAILABLE, DEPLOYED, DESTROYED, DECOMMISSIONED]
 *         description: Filter gadgets by status (optional)
 *     responses:
 *       200:
 *         description: List of gadgets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Gadget'
 *
 *   post:
 *     summary: Create a new gadget
 *     tags: [Gadgets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - success_probability
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the gadget (optional)
 *               success_probability:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 description: Probability of success (0-100, required)
 *     responses:
 *       201:
 *         description: Successfully created gadget
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Gadget'
 *       400:
 *         description: Invalid input or missing required fields
 *       500:
 *         description: Internal server error
 *
 * /api/v1/gadgets/{id}:
 *   put:
 *     summary: Update an existing gadget
 *     tags: [Gadgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique ID of the gadget to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated name of the gadget (optional)
 *               success_probability:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 description: Updated success probability (0-100, optional)
 *     responses:
 *       200:
 *         description: Successfully updated gadget
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Gadget'
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Gadget not found
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     summary: Delete a gadget
 *     tags: [Gadgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique ID of the gadget to delete
 *     responses:
 *       200:
 *         description: Successfully deleted gadget
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Gadget not found
 *       500:
 *         description: Internal server error
 * 
 * /api/v1/gadgets/{id}/self-destruct:
 *   post:
 *     summary: Self-destructs a gadget
 *     tags: [Gadgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the gadget to be destroyed
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: integer
 *                 minimum: 1000
 *                 maximum: 9999
 *                 description: The 4-digit destruction code (optional)
 *     responses:
 *       200:
 *         description: Gadget successfully destructed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Validation error (invalid ID or destruction code)
 *       401:
 *         description: Unauthorized (missing or invalid JWT)
 *       404:
 *         description: Gadget not found or invalid destruction code
 *       500:
 *         description: Internal server error
 */


const gadgetRouter = (router:Router) => {
    router.get('/gadgets',verifyJWT, validate(getGadgetSchema) ,getAllgadgets);
    router.post('/gadgets',verifyJWT,validate(createGadgetSchema),createGadgets);
    router.put('/gadgets/:id',verifyJWT,validate(updateGadgetSchema),updateGadgets);
    router.delete('/gadgets/:id',verifyJWT, validate(deleteGadgetSchema),deleteGadget);
    router.post('/gadgets/:id/self-destruct',verifyJWT, validate(destructGadgetSchema),destructGadget);
}

export default gadgetRouter;
