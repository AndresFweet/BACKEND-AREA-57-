import {Router} from 'express'
import webPush from "../../webPush.config.js"

const router = Router()

router.post('/subscribe', (req, res) => {
    const subscription = req.body
    //almacenar la subscricpcion en BD (opcional)
    res.status(201).json({})

    const payload = JSON.stringify({
        title: 'Notificación de Prueba',
        body: 'Esta es tu primera notificación push!'
      });

    webPush.sendNotification(subscription, payload).catch(error => {
        console.log(error);
    })

})

export default router