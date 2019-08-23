
class Zone {
    setState ({ zone, sensor, state }) {
        return new Promise((resolve, reject) => {
            process.DB.collection('zone').findOneAndUpdate(
                { zone }, {
                    $set: {
                        [sensor]: state
                    }
                }, {
                    upsert: true
                }, (err, doc) => {
                    if (err) reject(err);
                    resolve(doc);
                }
            );
        });
    }

    setControl ({ zone, control, state }) {
        return new Promise((resolve, reject) => {
            process.DB.collection('zone_controls').findOneAndUpdate(
                { zone }, {
                    $set: {
                        [control]: state
                    }
                }, {
                    upsert: true
                }, (err, doc) => {
                    if (err) reject(err);
                    resolve(doc);
                }
            );
        });
    }

    getControl ({ zone }) {
        return new Promise((resolve, reject) => {
            process.DB.collection('zone_controls').findOne({ zone }, (err, doc) => {
                if (err) reject(err);
                resolve(doc);
            });
        });
    }

    getAlarmState ({ zone }) {
        return new Promise((resolve, reject) => {
            process.DB.collection('zone_alarm').findOne({ zone }, (err, doc) => {
                if (err) reject(err);
                resolve(doc);
            });
        });
    }

    setAlarmState ({ zone, state }) {
        return new Promise((resolve, reject) => {
            process.DB.collection('zone_alarm').findOneAndUpdate(
                { zone }, {
                    $set: {
                        state
                    }
                }, {
                    upsert: true
                }, (err, doc) => {
                    if (err) reject(err);
                    resolve(doc);
                }
            );
        });
    }
}

export default new Zone()
