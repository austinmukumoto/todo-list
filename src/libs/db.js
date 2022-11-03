import { Sequelize } from 'sequelize'
import _ from 'underscore'
import * as models from '../models'
  
exports.schema = (config = {}, name = 'default') => {
    if (typeof global.schemas == 'undefined') {
        global.schemas = {}
    }
    let pool = config.pool || {}
    let sequelize;

    if (config.host) {
        sequelize = new Sequelize(config.database || 'database', config.username || 'root', config.password || '', {
            host: config.host || '127.0.0.1',
            dialect: config.driver || 'mysql',
            charset: config.charset || 'utf8',
            collate: config.collate || 'utf8_general_ci',
            timezone: config.timezone || '+08:00',
            dialectOptions: {
                dateStrings: true,
                typeCast: true
            },
            pool: {
                max: pool.max || 5,
                min: pool.min || 0,
                acquire: pool.acquire || 30000,
                idle: pool.idle || 10000
            }
        });
    } else {
        sequelize = new Sequelize(
            config.database || 'database',
            null,
            null,
            {
                dialect: 'mysql',
                charset: config.charset || 'utf8',
                collate: config.collate || 'utf8_general_ci',
                timezone: config.timezone || '+08:00',
                dialectOptions: {
                    dateStrings: true,
                    typeCast: true
                },
                port: config.port || 3306,
                replication: {
                    read: [{
                        host: config.host_reader,
                        username: config.username,
                        password: config.password
                    }],
                    write: {
                        host: config.host_writer,
                        username: config.username,
                        password: config.password
                    }
                },
                pool: {
                    max: 20,
                    idle: 30000
                }
            }
        )
    }

    _.each(models, (model) => {
        model.options.sequelize = sequelize
        model.init(model.tables, model.options)
    })

    _.each(models, (model) => {
        if (model.hasOwnProperty('setAssociations')) {
            model.setAssociations(models)
        }
    })

    global.schemas[name] = sequelize


    return sequelize
}

exports.model = (name, schema = 'default') => {
    if (typeof global.schemas !== 'undefined' && global.schemas[schema]) {
        let sequelize = global.schemas[schema]

        if (sequelize.models[name]) {
            return sequelize.models[name]
        }
    }

    return
}

exports.query = (raw, schema = 'default') => {
    if (typeof global.schemas !== 'undefined' && global.schemas[schema]) {
        let sequelize = global.schemas[schema]

        if (sequelize) {
            return sequelize.query[raw]
        }
    }

    return
}

exports.sync = (schema = 'default', options = {}) => {
    if (typeof global.schemas !== 'undefined' && global.schemas[schema]) {
        let sequelize = global.schemas[schema]

        if (sequelize) {
            sequelize.sync(options).then((response) => {

            })
        }
    }
}