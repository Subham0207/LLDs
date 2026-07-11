# Logger

1. Requirements
- log levels (extendible), timestamp, message
- log to multiple places like  file, console ( extensibility )
Error
    - invalid file exception
    - lock wait: max retries exhausted
Out of scope
- distributed application
Non functional requirement
- keep level extendible
- keep places to log to extendible
- Thread safety b/w multiple process to log to same place.


2. Core entities
- Logger
- LogLevels
    - info
    - warn
    - error
- logMessage
    - logLevel
    - timestamp
    - message
- LogTarget interface

enum LogLevel{
    info
    warn
    error
}

class LogMessage{
    LogLevel;
    timestamp;
    message: string;
}

class Logger
{
    private:
        targets: LogTarget[];
        flush(LogMessage)
        {
            targets.forEach(() => {
                target.write(LogMessage)
            })  
        }
    public:
        info(message)
        {
            const message = new LogMessage(LogLevel::info, Date.now(), message);
            flush(LogMessage)
        }
        error(message);
        warn(message);
    private:
        log(Level, message);
}

interface LogTarget{
    public write(LogMessage);
}

class File: LogTarget{
    private:
        File file;
    public:
        File(filePath)
        {
            if(File.exists(filePath))
                file = new File(filepath);
            else
                throw InvalidFileException();
        }
        }

        write(LogMessage)
        {
            try{
                while(retry < maxRetries)
                {
                    retry++;                    
                    if(lock.tryLock(500ms))
                    {
                        acquired = true;
                        const ref = file.open();
                        const message = `{
                            LogLevel,
                            timestamp,
                            message
                        }`
                        ref.append(message)
                        file.close();
                    }
                }
            }
            finally{
                if(!acquired)
                    throw LoggerTimeout();
                else
                    lock.release();
            }
        }
}

class Console: LogTarget{
    public:
        write(LogMessage)
}