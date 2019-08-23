/*
 * File: 'SVSocket.js'
 * Created by Dare McAdewole <dare.dev.adewole@gmail.com>
 * Created on Fri Jun 28 2019
 *
 * Copyright (c) 2019 Echwood Inc.
 *
 * Description:
 *       Socket for Sensor Data
 */
import SocketIO from 'socket.io';
import EventEmitter from 'eventemitter3';
import Logger from './Logger';
import Events from './Events';
import Store from './Store';

const SV_NAMESPACE = '/sv';

class Socket extends EventEmitter {
    
    /**
     * 
     * @param {*} server 
     */
    initialize (server) {
        this._clients = [];

        Logger.info('Initializing SV Socket ...');
        var IO = SocketIO.listen(server, {
            origins: '*:*'
        });

        Logger.info('Setting up Socket Authentication Middleware ... ');
        IO.use((socket, next) => {
            let token = socket.handshake.query.token;
            if (token === process.env.SOCKET_KEY) {
                return next();
            }
            return next(new Error('SV_SOCKET_AUTHENTICATION_ERROR'));
        });

        IO.of(SV_NAMESPACE).on('connection', (client) => {
            if (!this._clients.includes(client)) {
                // Send All current sensor and control states to newly connected client
                client.on(Events.SV_ALL_VALUES, () => {
                    Logger.info('Sending All current Values ... ');
                    Store.zones.forEach((zone, i) => {
                        Object.keys(zone.sensors).forEach(sensor => {
                            client.emit(Events.SV_SENSOR_DATA, {
                                zone: i + 1,
                                sensor,
                                state: zone.sensors[sensor]
                            });
                        });
                        Object.keys(zone.controls).forEach(control => {
                            client.emit(Events.SV_CONTROL_DATA, {
                                zone: i + 1,
                                control,
                                state: zone.controls[control]
                            });
                        });
                    });
                });

                this.on(Events.SV_NEW_FRAME_ARRIVED, (data) => {
                    client.emit(Events.SV_NEW_FRAME, data);
                });

                this.on(Events.SV_SENSOR_UPDATED, (data) => {
                    client.emit(Events.SV_SENSOR_DATA, data);
                });

                this.on(Events.SV_CONTROL_UPDATED, (data) => {
                    client.emit(Events.SV_CONTROL_DATA, data);
                });

                this.on(Events.SV_ALARM_STATE_UPDATED, (data) => {
                    client.emit(Events.SV_ALARM_STATE_DATA, data);
                });
            }

            this._clients.push(client);
            Logger.info(`${this._clients.length} clients(s) connected!`);

            client.on('disconnect', () => {
                this._clients.splice(this._clients.indexOf(client), 1);
                Logger.info(`1 client disconnected, Clients left: ${this._clients.length}`);
            });
        });
        Logger.info('Socket has been initialized successfully!');
    }
}

export default new Socket();
