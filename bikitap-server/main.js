/*
    (c) 2022 macesdev foundation, Inc.
    Bu modül COMTAL için M. Ali BULUT tarafından yapılmıştır.
    @mamiiblt
*/

const net = require('net');  
const fs = require('fs');
var server = net.createServer(); 
var port = 2589;
var bookFile = "C:\\Users\\maces\\Desktop\\books.json";
var classFilePath = "C:\\Users\\maces\\Desktop\\student.json";
var pass = "mami1212";


while (true) {
    try {
        server.listen(port, () => { 
            console.log('BiKitap Windows sunucusu başlatıldı. ', port); 
        }); 
        
        server.on("connection", (socket) => { 
            console.log("> " + socket.remoteAddress + ":" + socket.remotePort + " bağlandı!.");
            
            socket.on("data", (data) => { 
                
                var f = JSON.parse(data);
                
                if (f.auth == pass) {
                    if (f.req == "GET_STUDENT_DATA") {

                        /*console.log("lid: " + f.lew);
                        console.log("cindex: " + f.cindex)*/

                        let rawdata = fs.readFileSync(classFilePath);
                        var classFile = JSON.parse(rawdata);
                        var classes = classFile["class"];
                        
                        var sData = {
                            
                        }

                        var sde = classes[f.cindex];
                        var studye = sde["students"];
                        var stdnt = studye[f.lew];


                        sData["name"] = stdnt["name"];
                        sData["no"] = stdnt["no"];
                        sData["class"] = sde["name"];
                        sData["books"] = stdnt["books"];
                        sData["history"] = stdnt["history"];
                        /*sData["name"] = stdnt["name"];*/

                        socket.write(JSON.stringify(sData));
                        socket.end();
                    } else if (f.req == "TEST_FN") {
                        let rs = {
                            "response": "S-SUCCESS",
                            "desc": "Test fn çalıştı."
                        }
                        socket.write(JSON.stringify(rs));
                    } else if (f.req == "CREATE_RETURN_BOOK")  {
                        let rawdata = fs.readFileSync(classFilePath);
                        var classFile = JSON.parse(rawdata);
                        var classes = classFile["class"];

                        var sde = classes[f.cindex];
                        var studye = sde["students"];
                        var stdnt = studye[f.lew];
                        var newbdata = [

                        ];
                        var books = stdnt["books"]
                        var history = stdnt["history"]
                        const today = new Date();
                        const day = today.getDate();     
                        var month = today.getMonth() + 1;     
                        const year = today.getFullYear();

                        var rdate = day + "." + month + "." + year

                        var sStatus, lIndex;

                        for (i = 0; i < Object.keys(books).length; i++) {
                            if (i == f.talep) {
                                var oldData = books[i];

                                var newhistory = {
                                    "name": oldData["name"],
                                    "writer": oldData["writer"],
                                    "date": oldData["date"],
                                    "gived": oldData["gived"],
                                    "rdate": rdate
                                };

                                history[Object.keys(history).length] = newhistory;
                                sStatus = 1;
                                lIndex = i;
                                //console.log("durdu" + i);
                                for (i = lIndex; i < Object.keys(books).length; i++) {
                                    if (i + 1 < Object.keys(books).length) {
                                        newbdata[i] = books[i + 1];
                                        //console.log("2. geçti" + i + 1);
                                    }
                                }   
                                break;
                                
                            } else {
                                newbdata[i] = books[i];
                                //console.log("geçti" + i);
                            }

                            if (sStatus == 1) { 
                   
                            }  
                        }

                        /*console.log(Object.keys(books).length);
                        console.log(Object.keys(newhistory).length);
                        console.log(JSON.stringify(newbdata));
                        console.log(JSON.stringify(history));*/

                        stdnt["books"] = newbdata;
                        stdnt["history"] = history;
                        let rs = {
                            "response": "S-SUCCESS",
                            "desc": "Book sucessfully iadeded."
                        }

                        // fs.writeFileSync(classFilePath, JSON.stringify(" "));
                        fs.writeFile(classFilePath, JSON.stringify(classFile), (err) => {
                            if (err) throw err;
                            console.log('Data written to file');
                        });
                        socket.write(JSON.stringify(rs));
                        
                        console.log("İade başarılı");
                    } else if (f.req == "GET_ALL_CLASS_STUDENTS") {
                        let rawdata = fs.readFileSync(classFilePath);
                        var classFile = JSON.parse(rawdata);
                        var classes = classFile["class"];
                        
                        var sData = [

                        ]

                        var sde = classes[f.cindex];
                        var studye = sde["students"];

                        for (i = 0; i < Object.keys(studye).length; i++) {
                            var student = studye[i];
                            sData[i] = student["name"];
                        }

                        socket.write(JSON.stringify(sData));
                    }else if (f.req == "GET_ALL_CLASS_NAME") {
                        let rawdata = fs.readFileSync(classFilePath);
                        var classFile = JSON.parse(rawdata);
                        var classes = classFile["class"];
                        
                        var fle = [

                        ]

                        for (i = 0; i < Object.keys(classes).length; i++) {
                            
                            var classData = classes[i];
                            fle[i] = classData["name"];
                        }

                        socket.write(JSON.stringify(fle));

                    }
                    else if (f.req == "DELETE_BOOK") {
                        var deletIndex = f.bookid;
                        let rawdata = fs.readFileSync(bookFile);
                        var student = JSON.parse(rawdata);
                        let newjson = {
                            "version": 1,
                            "books": [
        
                            ]
                        }

                        var newbooks = newjson["books"]
                        var oBooks = student["books"];

                        var sStatus;
                        var lIndex;

                        if (deletIndex <= Object.keys(oBooks).length) {
                            for (i = 0; i < Object.keys(oBooks).length; i++) {
                                if (i == deletIndex) {
                                    sStatus = 1;
                                    lIndex = i;
                                    break;
                                } else {
                                    newbooks[i] = oBooks[i];
                                }
                            } 
    
                            if (sStatus == 1) { 
                                for (i = lIndex; i < Object.keys(oBooks).length; i++) {
                                    if (i + 1 < Object.keys(oBooks).length) {
                                        newbooks[i] = oBooks[i + 1];
                                    }
                                }                      
                            }  

                            let rs = {
                                "response": "S-SUCCESS",
                                "desc": "Book sucessfully removed."
                            }

                            fs.writeFileSync(bookFile, JSON.stringify(newjson));
                            socket.write(JSON.stringify(rs));
                        } else {
                            let rs = {
                                "response": "S-FAILED",
                                "desc": "Book not found."
                            }
    
                            socket.write(JSON.stringify(rs));
                        }
    
                    } else if (f.req == "GET_BOOKS") {
                        let rawdata = fs.readFileSync(bookFile);
                        var booksData = JSON.parse(rawdata);
                        var books = booksData["books"];
        
                        socket.write(JSON.stringify(books));
                    } else if (f.req == "CREATE_BOOK") {
                        let rawdata = fs.readFileSync(bookFile);
                        var student = JSON.parse(rawdata);
        
                        var oBooks = student["books"];
                        let newJson = {
                            "version": 1,
                            "books": [
        
                            ]
                        }
                        var nBooks = newJson["books"]
        
                        for (i = 0; i < Object.keys(oBooks).length; i++) {
                            nBooks[i] = oBooks[i];
                        } 
        
                        console.log(Object.keys(oBooks).length);
                        console.log(Object.keys(nBooks).length);
                        
                        const today = new Date();
                        const day = today.getDate();     
                        var month = today.getMonth() + 1;     
                        const year = today.getFullYear();

                        var date = day + "." + month + "." + year
                        let bookData = {
                            "i": Object.keys(nBooks).length,
                            "n": f.v1,
                            "w": f.v2,
                            "p": f.v3,
                            "b": f.v4,
                            "t": date,
                        }
        
                        nBooks[Object.keys(nBooks).length] = bookData;
                        console.log(Object.keys(nBooks).length);
                        console.log(JSON.stringify(newJson));

                        let rs = {
                            "response": "S-SUCCESS",
                        }

                        fs.writeFileSync(bookFile, JSON.stringify(newJson));
                        socket.write(JSON.stringify(rs));
                    } else if (f.req == "LOGIN") {
                        if (f.auth == pass) {
                            const c = {
                                response: 'S-SUCCESS',
                                desc: 'Authorization Complete.'
                            };
        
                            socket.write(JSON.stringify(c));
                        }
                    }else {
                        const nonfn = {
                            response: 'S-ERROR',
                            desc: 'Undefined request.'
                        };
        
                        socket.write(JSON.stringify(nonfn));
                    }
                } else {
                    const c = {
                        response: 'S-ERROR',
                        desc: 'Authorization Failed.'
                    };
        
                    socket.write(JSON.stringify(c));
                }
        
                socket.end();
            }); 
        
            socket.once("close", () => { 
                console.log("> " + socket.remoteAddress + ":" + socket.remotePort + " bağlantıyı kesti."); 
            }); 
        
        }); 
        break;
    } catch {
        console.log("> Hata saptandı, yeniden başlatılıyor..")
    }
}