import { responseHelper } from '../helpers/response';
import Service from '../models/Service';

export const addService = async (req, res, next) => {
    const { name, price, status } = req.body;

    try {
        const service = new Service({
            name,
            price,
            status,
        });

        await service.save();

        return res.json(responseHelper(200, 'Dịch vụ đã được thêm thành công', true, service));
    } catch (error) {
        next(error);
    }
};

export const getAllServices = async (req, res, next) => {
    try {
        const services = await Service.find();
        return res.json(responseHelper(200, 'Danh sách dịch vụ', true, services));
    } catch (error) {
        next(error);
    }
};