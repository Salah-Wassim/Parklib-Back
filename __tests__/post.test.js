const Post = require('../models').Post;
const { getCache, setCache } = require('../redis/cache.js');
const {list_post} = require("../controllers/post.controller");
const Response = require("../utils/response.util.js");
const HttpStatus = require("../utils/httpStatus.util.js");

jest.mock("../models", () => ({
    Post: {
        findAll: jest.fn(),
        findOne: jest.fn()
    }
}));

jest.mock("../redis/cache.js", () => ({
    getCache: jest.fn(),
    setCache: jest.fn(),
}))

jest.mock("../utils/response.util.js");

jest.mock("../utils/httpStatus.util.js", () => ({
    OK: { code: 200, message: "OK" },
    NOT_FOUND: { code: 404, message: "Not Found" },
    BAD_REQUEST: { code: 400, message: "Bad request" },
    INTERNAL_SERVER_ERROR: { code: 500, message: "Internal Server Error" },
    CREATED: { code : 201, message : "Created"},
    NO_CONTENT:{ code : 204, message : "NO_CONTENT"},
}));

describe("findAllPost", () => {
    let req, res;

    beforeEach(() => {
        req = {
            methods: "GET",
            originalUrl: "/post"
        },
        res = {
            status : jest.fn().mockReturnThis(),
            send: jest.fn()
        }
    })

    afterEach(() => {
        jest.clearAllMocks();
    })

    test("Should return all post from cache if available", async () => {
        const cachedPost = [
            {
                "id": 2,
			    "title": "zertyuiop",
			    "description": "blabla",
			    "price": 100,
			    "typeOfPlace": "souterrain",
			    "contact": "email",
			    "isAssured": true,
            }
        ];

        getCache.mockResolvedValue(cachedPost)

        await list_post(req, res);

        expect(getCache).toHaveBeenCalledWith('posts');
        expect(res.status).toHaveBeenCalledWith(HttpStatus.OK.code);
        expect(Response).toHaveBeenCalledWith(
            HttpStatus.OK.code,
            HttpStatus.OK.message,
            `Post cached retrieved`,
            cachedPost
        );
        expect(res.send).toHaveBeenCalledWith(new Response());
        expect(Post.findAll).not.toHaveBeenCalled();
        expect(setCache).not.toHaveBeenCalled();
    })

    test("should retrieve posts from database if not cached", async () => {
        const posts = [
            {
                "id": 2,
			    "title": "zertyuiop",
			    "description": "blabla",
			    "price": 100,
			    "typeOfPlace": "souterrain",
			    "contact": "email",
			    "isAssured": true,
            }
        ];

        const postList = [
            {
                "id": 2,
			    "title": "zertyuiop",
			    "description": "blabla",
			    "price": 100,
			    "typeOfPlace": "souterrain",
			    "contact": "email",
			    "isAssured": true,
            }
        ];

        getCache.mockResolvedValue(null);
        Post.findAll.mockResolvedValue(posts);
        setCache.mockResolvedValue();

        const statusSpy = jest.spyOn(res, "status");

        await list_post(req, res);

        expect(getCache).toHaveBeenCalledWith("posts");
        expect(Post.findAll).toHaveBeenCalled({
            order: [['price', 'DESC']]
        })

        expect(setCache).toHaveBeenCalledWith("posts", posts)
        expect(statusSpy).toHaveBeenCalledWith(HttpStatus.OK.code)
        expect(Response).toHaveBeenCalledWith(
            HttpStatus.OK.code,
            HttpStatus.OK.message,
            `All post are retrieved`,
            postList
        )
        expect(res.send).toHaveBeenCalledWith(new Response());
    });

    test("should handle database retrieval error", async () => {
        const error = new Error("Database error");

        getCache.mockResolvedValue(null);
        Post.findAll.mockRejectedValue(error);

        await list_post(req, res);

        expect(getCache).toHaveBeenCalledWith("posts");
        expect(Post.findAll).toHaveBeenCalledWith({
            order: [['price', 'DESC']]
        });

        expect(setCache).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR.code);
        expect(Response).toHaveBeenCalledWith(
            HttpStatus.INTERNAL_SERVER_ERROR.code,
            HttpStatus.INTERNAL_SERVER_ERROR.message,
            "Some error occurred while retrieving posts"
        );
        expect(res.send).toHaveBeenCalledWith(new Response());
    });
})