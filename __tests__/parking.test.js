const ParkingParticulier = require("../models").ParkingParticulier;
const Post = require('../models').Post;
const {findAllParkingParticulier, addParkingParticulier, updateParkingParticulier, deleteParkingParticulier} = require("../controllers/parkingParticulier.controller");
const { getCache, setCache } = require('../redis/cache.js');
const Response = require("../utils/response.util.js");
const HttpStatus = require("../utils/httpStatus.util.js");

jest.mock("../models", () => ({
    ParkingParticulier: {
        findAll: jest.fn(),
        create: jest.fn(),
        findByPk: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn(),
    },
    Post: {}
}));
  
jest.mock("../redis/cache.js", () => ({
    getCache: jest.fn(),
    setCache: jest.fn()
}));
  
jest.mock("../utils/response.util.js");
  
jest.mock("../utils/httpStatus.util.js", () => ({
    OK: { code: 200, message: "OK" },
    NOT_FOUND: { code: 404, message: "Not Found" },
    BAD_REQUEST: { code: 400, message: "Bad request" },
    INTERNAL_SERVER_ERROR: { code: 500, message: "Internal Server Error" },
    CREATED: { code : 201, message : "Created"},
    NO_CONTENT:{ code : 204, message : "NO_CONTENT"},
    FORBIDDEN:{code:403,message:"FORBIDDEN"}
}));

describe("findAllParkingParticulier", () => {
    let req, res;
  
    beforeEach(() => {
      req = { method: "GET", originalUrl: "/parking-particulier" };
      res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });

    test("should retrieve parking from cache if available", async () => {
        const cachedParking = [{
            id: 1,
            address: "15 rue des Moutons",
            zipCode: "33000",
            city: "Bordeaux",
            latitude: 0,
            longitude: 0,
            createdAt: "2023-05-13T05:59:33.000Z",
            updatedAt: "2023-05-13T05:59:33.000Z",
            UserId: 1
        }];
        getCache.mockResolvedValue(cachedParking);
    
        await findAllParkingParticulier(req, res);
    
        expect(getCache).toHaveBeenCalledWith("parkings");
        expect(res.status).toHaveBeenCalledWith(HttpStatus.OK.code);
        expect(Response).toHaveBeenCalledWith(
          HttpStatus.OK.code,
          HttpStatus.OK.message,
          "Parking cached retrieved",
          cachedParking
        );
        expect(res.send).toHaveBeenCalledWith(new Response());
        expect(ParkingParticulier.findAll).not.toHaveBeenCalled();
        expect(setCache).not.toHaveBeenCalled();
    });

    test("should retrieve parkings from database if not cached", async () => {
        const parkings = [
            {
                id: 1,
                address: "15 rue des Moutons",
                zipCode: "33000",
                city: "Bordeaux",
                latitude: 0,
                longitude: 0,
                createdAt: "2023-05-13T05:59:33.000Z",
                updatedAt: "2023-05-13T05:59:33.000Z",
                UserId: 1
            }, 
        ];
        const parkingParticulierAllList = [
            {
                id: 1,
                address: "15 rue des Moutons",
                zipCode: "33000",
                city: "Bordeaux",
                latitude: 0,
                longitude: 0,
                createdAt: "2023-05-13T05:59:33.000Z",
                updatedAt: "2023-05-13T05:59:33.000Z",
                UserId: 1
            }
        ];
    
        getCache.mockResolvedValue(null);
        ParkingParticulier.findAll.mockResolvedValue(parkings);
        setCache.mockResolvedValue();

        const statusSpy = jest.spyOn(res, "status");
    
        await findAllParkingParticulier(req, res);
    
        expect(getCache).toHaveBeenCalledWith("parkings");
        expect(ParkingParticulier.findAll).toHaveBeenCalledWith({
            order: [["createdAt", "DESC"]],
            include: [
                {
                    model: Post
                }
            ]
        });
        expect(setCache).toHaveBeenCalledWith("parkings", parkings);
        expect(statusSpy).toHaveBeenCalledWith(HttpStatus.OK.code)
        expect(Response).toHaveBeenCalledWith(
            HttpStatus.OK.code,
            HttpStatus.OK.message,
            `ParkingParticuliers retrieved`,
            parkingParticulierAllList
        )
        expect(res.send).toHaveBeenCalledWith(new Response());
    });

    test("should handle database retrieval error", async () => {
        const error = new Error("Database error");

        getCache.mockResolvedValue(null);
        ParkingParticulier.findAll.mockRejectedValue(error);

        await findAllParkingParticulier(req, res);

        expect(getCache).toHaveBeenCalledWith("parkings");
        expect(ParkingParticulier.findAll).toHaveBeenCalledWith({
            order: [["createdAt", "DESC"]],
            include: [
                {
                    model: Post
                }
            ]
        });
        expect(setCache).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR.code);
        expect(Response).toHaveBeenCalledWith(
            HttpStatus.INTERNAL_SERVER_ERROR.code,
            HttpStatus.INTERNAL_SERVER_ERROR.message,
            "Some error occurred while retrieving parkings"
        );
        expect(res.send).toHaveBeenCalledWith(new Response());
    });
})

describe("addParkingParticulier", () => {
    let req, res
  
    beforeEach(() => {
        req = {
            method: "POST", 
            originalUrl: "/parking-particulier/add",
            body: {
                address: "15 rue des Moutons",
                zipCode: "33000",
                city: "Bordeaux",
            },
            user: { id: 1 }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
    });
  
    afterEach(() => {
        jest.clearAllMocks();
    });
  
    test("should create a new parking particulier", async () => {

        const createdParking = {
            address: "15 rue des Moutons",
            zipCode: "33000",
            city: "Bordeaux",
            longitude: 0,
            lattitude: 0,
            UserId: 1
        };

        ParkingParticulier.create.mockResolvedValue(createdParking);
   
        const statusSpy = jest.spyOn(res, "status");

        await addParkingParticulier(req, res);
  
        expect(statusSpy).toHaveBeenCalledWith(HttpStatus.CREATED.code);
        expect(Response).toHaveBeenCalledWith(
            HttpStatus.CREATED.code,
            HttpStatus.CREATED.message,
            "Parking is created",
            createdParking
        );
        expect(res.send).toHaveBeenCalledWith(new Response());
    });
});

describe("update parking", () => {
    let req, res;

    beforeEach(() => {
      req = {
        method: "PUT",
        originalUrl: "/parking-particulier/123",
        params: { id: 3 },
        user: { id: 4 },
        body: {
            address: "28 rue Jean Jaures",
            zipCode: "33000",
            city: "Bordeaux"
        },
      };
      res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      
      jest.clearAllMocks();
    });

    test('should update a parking particulier', async () => {
        const updatedParking = {
            id: 3,
            address: "28 rue Jean Jaures",
            zipCode: "33000",
            city: "Paris",
            lattitude: null,
            longitude: null,
            createdAt: "2024-03-09T08:17:20.000Z",
            updatedAt: "2024-03-09T08:19:18.000Z",
            UserId: 4
        };

        ParkingParticulier.findOne.mockResolvedValueOnce({
            id: 3,
            UserId: 4
        });
        const mockUpdate = jest.fn(() => Promise.resolve([1]));
        require("../models").ParkingParticulier.update = mockUpdate;

        await updateParkingParticulier(req, res);

        expect(ParkingParticulier.findOne).toHaveBeenCalledWith({ where: { id: 3 } });
        expect(res.status).toHaveBeenCalledWith(HttpStatus.OK.code);
        expect(res.send).toHaveBeenCalledWith(
            new Response(
                HttpStatus.OK.code, 
                HttpStatus.OK.message, 
                'Parking updated', 
                updatedParking
            )
        );
        expect(res.send).toHaveBeenCalledWith(new Response());
    });
});

describe('deleteParkingParticulier function', () => {
    let res, req;

    beforeEach(() => {
        req = {
            method: "DELETE",
            originalUrl: '/parking-particulier/1',
            params: {
                id: 1
            },
            user: {
                id: 2
            }
        };
    
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };

        jest.clearAllMocks();
    });

    test('should delete parking and return 204 status code', async () => {
        ParkingParticulier.findOne.mockResolvedValueOnce({
            id: 1,
            UserId: 2
        });

        ParkingParticulier.destroy.mockResolvedValueOnce([1]);

        const statusSpy = jest.spyOn(res, "status");

        await deleteParkingParticulier(req, res);

        expect(ParkingParticulier.findOne).toHaveBeenCalledWith({
            where: { id: 1 }
        });

        expect(ParkingParticulier.destroy).toHaveBeenCalledWith({
            where: { id: 1 }
        });

        expect(statusSpy).toHaveBeenCalledWith(HttpStatus.NO_CONTENT.code);
        expect(Response).toHaveBeenCalledWith(
            HttpStatus.NO_CONTENT.code,
            HttpStatus.NO_CONTENT.message,
            `Parking and role was deleted successfully!`
        );
        expect(res.send).toHaveBeenCalledWith(new Response());
    });
})