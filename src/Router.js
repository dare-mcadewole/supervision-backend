/*
 * File: 'Router.js'
 * Created by Dare McAdewole <dare.dev.adewole@gmail.com>
 * Created on Fri Jun 28 2019
 *
 * Copyright (c) 2019 Echwood Inc.
 *
 * Description:
 *       Router for RESTIFY web server
 */
import Socket from './Socket';
import Logger from './Logger';
import ZoneController from './controllers/ZoneController';
import VideoController from './controllers/VideoController';

const zones = [1, 2, 3];

var idValidation = (req, reply, next, param, includesArray) => {
    var id = parseInt(req.params[param]);
    if (!includesArray.includes(id)) {
        return reply.send({ msg: 'INVALID_ID_PARAMETER' });
    }
    return next();
};
 
export default class Router {

    /**
     *
     * @param {*} ServerInstance
     */
    static initRoutes (App, ServerInstance) {
        Logger.info('Initializing Super+Vision Routes ... ');
        // Initialize and setup Socket
        Socket.initialize(ServerInstance);

        App.get('/api', (req, reply, next) => {
            reply.send({
                name: 'Super+Vision API',
                version: '2.0'
            });
            return next();
        });

        App.put(
            '/api/zone/:zone_id',
            (req, reply, next) => idValidation(req, reply, next, 'zone_id', zones),
            (req, reply, next) => ZoneController.setSensor(Socket, req, reply, next)
        );

        App.post(
            '/api/zone/:zone_id/video',
            (req, reply, next) => idValidation(req, reply, next, 'zone_id', zones),
            (req, reply, next) => VideoController.sendImage(Socket, req, reply, next)
        );

        App.put(
            '/api/zone/:zone_id/control',
            (req, reply, next) => idValidation(req, reply, next, 'zone_id', zones),
            (req, reply, next) => ZoneController.setControl(Socket, req, reply, next)
        );

        App.put(
            '/api/zone/:zone_id/alarm',
            (req, reply, next) => idValidation(req, reply, next, 'zone_id', zones),
            (req, reply, next) => ZoneController.setAlarmState(Socket, req, reply, next)
        );

        Logger.info('All Super+Vision Routes Initialized successfully!');
    }
}
