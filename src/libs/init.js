import db from "./db.js"


const init = async () => {
    try {

        console.log('Connection Initialize .....');
    
        db.schema({
            database: process.env.DB_NAME || 'test_todo_union_bank',
            username: process.env.DB_USERNAME || 'root',
            password: process.env.DB_PASSWORD || '',
            host: process.env.DB_HOST || '127.0.0.1'
        });
    
        console.log('Status: Connection Success');
    
        try {
            console.log('Models syncing.....')
    
            db.sync()
    
            console.log('Status: Models Syncing Success')
    
        } catch (error) {
            console.log('Status: Models Syncing Failed', error.message)
        }
    
    } catch (error) {
        console.log('Status: Connection Failed', error.message);
    }
}

export default init;

