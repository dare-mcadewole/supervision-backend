import Sensors from '../Sensors'
import Controls from '../Controls'
import {
    INVALID_SENSOR, INVALID_SENSOR_STATE, INVALID_CONTROL_STATE, INVALID_CONTROL
} from '../Messages'
import Events from '../Events'
import Store from '../Store'
import Zone from '../models/Zone'
import Logger from '../Logger'

export default class ZoneController {

    static async setSensor(Socket, {
        params: {
            zone_id
        },
        body: {
            sensor, state
        }
    }, reply, next) {
        try {
            zone_id = parseInt(zone_id);
            if (Sensors[sensor]) {
                if (typeof(state) === "boolean") {
                    let zoneInfo = {
                        zone: zone_id,
                        sensor,
                        state
                    }
                    await Zone.setState(zoneInfo)
                    // Save in the store
                    Store.zones[zone_id - 1].sensors[sensor] = state;
                    Logger.info(`Updating Zone ${zone_id}, ${sensor} sensor to '${state}'`)
                    Socket.emit(Events.SV_SENSOR_UPDATED, zoneInfo)
                    return reply.send(zoneInfo)
                } else {
                    return reply.send({
                        msg: INVALID_SENSOR_STATE
                    })
                }
            }
            reply.send({
                msg: INVALID_SENSOR
            })
        } catch (ex) {
            reply.send(ex)
        } finally {
            return next();
        }
    }

    static async setControl(Socket, {
        params: {
            zone_id
        },
        body: {
            control, state
        }
    }, reply, next) {
        try {
            zone_id = parseInt(zone_id);
            if (Controls[control]) {
                if (typeof(state) === "boolean") {
                    let controlInfo = {
                        zone: zone_id,
                        control,
                        state
                    }
                    await Zone.setControl(controlInfo)
                    // Save in the store
                    Store.zones[zone_id - 1].controls[control] = state;
                    Logger.info(`Updating Zone ${zone_id}, ${control} control to '${state}'`)
                    Socket.emit(Events.SV_CONTROL_UPDATED, controlInfo)
                    return reply.send(controlInfo)
                } else {
                    return reply.send({
                        msg: INVALID_CONTROL_STATE
                    })
                }
            }
            reply.send({
                msg: INVALID_CONTROL
            })
        } catch (ex) {
            reply.send(ex)
        } finally {
            return next();
        }
    }

    static async setAlarmState(Socket, {
        params: {
            zone_id
        },
        body: {
            state
        }
    }, reply, next) {
        try {
            zone_id = parseInt(zone_id);
            if (typeof(state) === "boolean") {
                let alarm = {
                    zone: zone_id,
                    state
                }
                await Zone.setAlarmState(alarm)
                Logger.info(`Updating Zone ${zone_id} Alarm state to '${state}'`)
                Socket.emit(Events.SV_ALARM_STATE_UPDATED, alarm)
                return reply.send(alarm)
            } else {
                return reply.send({
                    msg: INVALID_CONTROL_STATE
                })
            }
        } catch (ex) {
            reply.send(ex)
        } finally {
            return next();
        }
    }

    static async getControl({
        params: { zone_id }
    }, reply, next) {
        try {
            var zone = parseInt(zone_id);
            var data = await Zone.getControl({ zone }) || {};
            reply.send(data);
        } catch (ex) {
            reply.send(ex)
        } finally {
            return next();
        }
    }
    
    static async getAlarmState({
        params: { zone_id }
    }, reply, next) {
        try {
            var zone = parseInt(zone_id);
            var data = await Zone.getAlarmState({ zone }) || {};
            reply.send(data);
        } catch (ex) {
            reply.send(ex)
        } finally {
            return next();
        }
    }

}
