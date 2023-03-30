import bunyan from 'bunyan'

export const createLogger = (name: string): bunyan => {
	return bunyan.createLogger({
		name,
		level: 'debug',
		serializers: bunyan.stdSerializers,
	})
}
