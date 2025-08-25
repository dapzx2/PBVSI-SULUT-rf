"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
exports.getAdminUserById = getAdminUserById;
exports.getAdminUserByEmail = getAdminUserByEmail;
exports.getAdminUserByUsername = getAdminUserByUsername;
exports.createAdminUser = createAdminUser;
exports.updateAdminUser = updateAdminUser;
exports.deleteAdminUser = deleteAdminUser;
var mysql_1 = require("./mysql");
var uuid_1 = require("uuid");
var bcrypt = require("bcryptjs");
function hashPassword(password) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, bcrypt.hash(password, 12)];
        });
    });
}
function verifyPassword(password, hash) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, bcrypt.compare(password, hash)];
        });
    });
}
function getAdminUserById(id) {
    return __awaiter(this, void 0, void 0, function () {
        var rows, adminUsers, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, mysql_1.default.query('SELECT * FROM admin_users WHERE id = ?', [id])];
                case 1:
                    rows = (_a.sent())[0];
                    adminUsers = rows;
                    if (adminUsers.length === 0) {
                        return [2 /*return*/, { adminUser: null, error: 'Admin user not found' }];
                    }
                    return [2 /*return*/, { adminUser: adminUsers[0], error: null }];
                case 2:
                    error_1 = _a.sent();
                    return [2 /*return*/, { adminUser: null, error: error_1.message }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getAdminUserByEmail(email) {
    return __awaiter(this, void 0, void 0, function () {
        var rows, adminUsers, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, mysql_1.default.query('SELECT * FROM admin_users WHERE email = ?', [email])];
                case 1:
                    rows = (_a.sent())[0];
                    adminUsers = rows;
                    if (adminUsers.length === 0) {
                        return [2 /*return*/, { adminUser: null, error: 'Admin user not found' }];
                    }
                    return [2 /*return*/, { adminUser: adminUsers[0], error: null }];
                case 2:
                    error_2 = _a.sent();
                    return [2 /*return*/, { adminUser: null, error: error_2.message }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getAdminUserByUsername(username) {
    return __awaiter(this, void 0, void 0, function () {
        var rows, adminUsers, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, mysql_1.default.query('SELECT * FROM admin_users WHERE username = ?', [username])];
                case 1:
                    rows = (_a.sent())[0];
                    adminUsers = rows;
                    if (adminUsers.length === 0) {
                        return [2 /*return*/, { adminUser: null, error: 'Admin user not found' }];
                    }
                    return [2 /*return*/, { adminUser: adminUsers[0], error: null }];
                case 2:
                    error_3 = _a.sent();
                    return [2 /*return*/, { adminUser: null, error: error_3.message }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function createAdminUser(userData) {
    return __awaiter(this, void 0, void 0, function () {
        var newAdminUserId, hashedPassword, newAdminUser, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    newAdminUserId = (0, uuid_1.v4)();
                    return [4 /*yield*/, hashPassword(userData.password_hash)];
                case 1:
                    hashedPassword = _a.sent();
                    newAdminUser = __assign(__assign({ id: newAdminUserId }, userData), { password_hash: hashedPassword });
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, mysql_1.default.query('INSERT INTO admin_users SET ?', newAdminUser)];
                case 3:
                    _a.sent();
                    return [2 /*return*/, { adminUser: newAdminUser, error: null }];
                case 4:
                    error_4 = _a.sent();
                    return [2 /*return*/, { adminUser: null, error: error_4.message }];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function updateAdminUser(id, userData) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, adminUser, error_5;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, , 6]);
                    if (!userData.password_hash) return [3 /*break*/, 2];
                    _a = userData;
                    return [4 /*yield*/, hashPassword(userData.password_hash)];
                case 1:
                    _a.password_hash = _b.sent();
                    _b.label = 2;
                case 2: return [4 /*yield*/, mysql_1.default.query('UPDATE admin_users SET ? WHERE id = ?', [userData, id])];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, getAdminUserById(id)];
                case 4:
                    adminUser = (_b.sent()).adminUser;
                    return [2 /*return*/, { adminUser: adminUser, error: null }];
                case 5:
                    error_5 = _b.sent();
                    return [2 /*return*/, { adminUser: null, error: error_5.message }];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function deleteAdminUser(id) {
    return __awaiter(this, void 0, void 0, function () {
        var result, deleteResult, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, mysql_1.default.query('DELETE FROM admin_users WHERE id = ?', [id])];
                case 1:
                    result = (_a.sent())[0];
                    deleteResult = result;
                    if (deleteResult.affectedRows === 0) {
                        return [2 /*return*/, { success: false, error: 'Admin user not found' }];
                    }
                    return [2 /*return*/, { success: true, error: null }];
                case 2:
                    error_6 = _a.sent();
                    return [2 /*return*/, { success: false, error: error_6.message }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
