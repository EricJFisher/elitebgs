/*
 * KodeBlox Copyright 2017 Sayak Mukhopadhyay
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http: //www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use strict";

let mongoosePaginate = require('mongoose-paginate');

module.exports = (async () => {
    let db = require('../db');
    let connection = db.elite_bgs;
    let mongoose = db.mongoose;
    let Schema = mongoose.Schema;

    let ebgsSystem = new Schema({
        eddb_id: Number,
        edsm_id: Number,
        name: String,
        name_lower: { type: String, lowercase: true, index: true },
        x: Number,
        y: Number,
        z: Number,
        population: Number,
        government: { type: String, lowercase: true, index: true },
        allegiance: { type: String, lowercase: true, index: true },
        state: { type: String, lowercase: true, index: true },
        security: { type: String, lowercase: true, index: true },
        primary_economy: { type: String, lowercase: true, index: true },
        power: [{ type: String, lowercase: true }],
        power_state: { type: String, lowercase: true, index: true },
        needs_permit: Boolean,
        updated_at: Date,
        simbad_ref: { type: String, lowercase: true },
        controlling_minor_faction: { type: String, lowercase: true },
        reserve_type: { type: String, lowercase: true },
        minor_faction_presences: [{
            _id: false,
            name: String,
            name_lower: { type: String, lowercase: true }
        }]
    }, { runSettersOnQuery: true });

    ebgsSystem.plugin(mongoosePaginate);

    let model = connection.model('ebgsSystem', ebgsSystem);

    return model;
})();
