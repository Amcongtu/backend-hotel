import { responseHelper } from '../helpers/response.js';
import Service from '../models/Service.js';

export const addService = async (req, res, next) => {
    const { name, price, status, image, image_id, description, service } = req.body;

    try {
        const service = new Service({
            service,
            name,
            price,
            status,
            image,
            image_id,
            description
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

export const getAllServicesPublish = async (req, res, next) => {
    try {
        const services = await Service.find({status:'active'});
        return res.json(responseHelper(200, 'Danh sách dịch vụ', true, services));
    } catch (error) {
        next(error);
    }
};