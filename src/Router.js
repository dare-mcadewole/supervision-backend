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
import WMSSocket from './WMSSocket';
import Logger from './Logger';
import TerminalController from './controllers/TerminalController';
import TankController from './controllers/TankController';
import BillingController from './controllers/BillingController';
import ValveController from './controllers/ValveController';

let Authorize = (req, res, next) => {
    if (req.header('Authorization') !== `Bearer ${process.env.AUTH_KEY}`) {
        return reply.send(403, { msg: 'UNAUTHORIZED' });
    }
    return next();
};

export default class Router {

    /**
     *
     * @param {*} ServerInstance
     */
    static initRoutes (ServerInstance) {
        Logger.info('Initializing WMS Routes ... ');
        // Initialize and setup WMSSocket
        WMSSocket.initialize(ServerInstance);

        ServerInstance.get('/api', (req, reply, next) => {
            reply.send({
                name: 'Water Supervisory Control API',
                version: '1.0.1'
            });
            return next();
        });

        ServerInstance.get('/api/valve/:terminal_id', ValveController.getValveState);

        // ServerInstance.post('/api/terminal/:terminal_id', Authorize);
        // ServerInstance.post('/api/terminal/state/:terminal_id', Authorize);
        // ServerInstance.post('/api/tank/pump', Authorize);
        // ServerInstance.post('/api/tank/level', Authorize);
        // ServerInstance.post('/api/terminal/billing/:terminal_id', Authorize);

        ServerInstance.post(
            '/api/terminal/:terminal_id',
            (req, reply, next) => {
                var terminal_id = parseInt(req.params.terminal_id);
                if (![1, 2, 3, 4].includes(terminal_id)) {
                    return reply.send({ msg: 'INVALID_TERMINAL_ID' });
                }
                return next();
            },
            (req, reply, next) => TerminalController.updateTerminal(WMSSocket, req, reply, next)
        );

        // /api/terminal/state/:terminal_id
        ServerInstance.post(
            '/api/terminal/state/:terminal_id',
            (req, reply, next) => TerminalController.updateTerminalState(WMSSocket, req, reply, next)
        );

        // /api/tank/init
        ServerInstance.post(
            '/api/tank/init',
            TankController.initialize
        );

        // /api/tank/pump?
        ServerInstance.post(
            '/api/tank/pump',
            (req, reply, next) => {
                TankController.setPumpState(WMSSocket, req, reply, next);
            }
        );

        // /api/tank/level
        ServerInstance.post(
            '/api/tank/level',
            (req, reply, next) => {
                TankController.setWaterLevel(WMSSocket, req, reply, next);
            }
        );

        ServerInstance.post(
            '/api/terminal/billing/:terminal_id',
            (req, reply, next) => {
                BillingController.updateBilling(WMSSocket, req, reply, next);
            }
        )
        Logger.info('All WMS Routes Initialized successfully!');
    }
}
