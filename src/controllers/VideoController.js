import Logger from '../Logger';
import fs from 'fs';
import path from 'path';
import Image2Base64 from 'image-to-base64';
import { NO_FRAME, INVALID_FRAME_FORMAT } from '../Messages';
import Events from '../Events';

const IMAGE_PATH = path.resolve(__dirname, '../frame_temp', 'frame.jpg');
export default class VideoController {
    
    static async sendImage (Socket, {
        params: { zone_id },
        files: { frame }
    }, reply, next) {
        if (frame) {
            zone_id = parseInt(zone_id);
            if (frame.mimetype === 'image/jpeg') {
                try {
                    fs.writeFileSync(
                        IMAGE_PATH,
                        frame.data
                    );
                    var base64Image = await Image2Base64(IMAGE_PATH);
                    Logger.info('New Frame arrived');
                    Socket.emit(Events.SV_NEW_FRAME_ARRIVED, {
                        zone: zone_id,
                        frame: base64Image
                    });
                    reply.send({
                        zone: zone_id,
                        msg: 'SUCCESS'
                    });
                } catch (e) {
                    reply.send(e);
                } finally {
                    return;
                }
            } else {
                return reply.send({
                    msg: INVALID_FRAME_FORMAT
                })
            }
        }
        reply.send({
            msg: NO_FRAME
        })
    }
}
