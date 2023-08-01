/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./tables.controller");

router.route("/")
    .post(controller.create)
    .get(controller.list)
    
router.route("/:table_id/seat")
    .put(controller.update)
    .delete(controller.destroy)
    
router.route("/:table_id")
    .get(controller.read)
    

module.exports = router;
