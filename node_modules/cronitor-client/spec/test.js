describe("CronitorClient: ", function() {
  var CronitorClient = require('../index.js');
  var api_token = process.env['ACCESS_TOKEN'] || null;
  if( !api_token){
    console.log("No access token provided. Please set 'ACCESS_TOKEN' environment variable before running test.");
    process.abort()
  }

  describe("check unauthorized request", function(){
    var callback = jasmine.createSpy('callback');
    var cc = null;
    beforeEach( function(done){
      cc = new CronitorClient();
      done();
    });

    it("should fail request", function(done){
      
      cc.all( function(err, body){
        callback(err,body);
        expect( callback).toHaveBeenCalled();
        expect( callback.calls.mostRecent().args[0] ).not.toBe(null);
        done();
      });

    });

  });


  describe("Authorized requests:" , function(){
    var cc = null;
    beforeAll( function(done){
      cc = new CronitorClient({ access_token: process.env['ACCESS_TOKEN'] });
      done();
    });

    it("should fetch all monitors", function(done){
      var callback = jasmine.createSpy("callback");
      cc.all( function(err, body){
        callback(err,body);
        expect( callback).toHaveBeenCalled();
        expect( callback.calls.mostRecent().args[0] ).toBe(null);
        expect( typeof callback.calls.mostRecent().args[1]).toBe('object');
        done();
      });
    });

  });

  describe("CRUD operations: ", function(){

    var existingMonitorCode = null;
    var cc = null;
    beforeAll( function(done){
      cc = new CronitorClient({ access_token: process.env['ACCESS_TOKEN'] });
      done();
    });

    it("- should create new monitor", function(done){
      var callback = jasmine.createSpy("callback");
      var newMonitor = {
          "name": "Testing_Cronitor_Client",
          "notifications": {
              "phones": [], 
              "webhooks": [], 
              "emails": [
                  "sonukr666@xyz.com"
              ]
          }, 
          "rules": [
              {
                  "rule_type": "not_run_in", 
                  "duration": 1, 
                  "time_unit": "minutes"
              },
              {
                  "rule_type": "ran_longer_than", 
                  "duration": 1, 
                  "time_unit": "minutes"
              }
          ],
          "note": "Created by cronitor.io node.js client: version 1"
      };

      cc.new( newMonitor, function(err, body){
        callback(err,body);
        expect( callback).toHaveBeenCalled();
        expect( callback.calls.mostRecent().args[0] ).toBe(null);

        expect( typeof callback.calls.mostRecent().args[1]).toBe('object');
        if( callback.calls.mostRecent().args[1] ){
           existingMonitorCode = callback.calls.mostRecent().args[1]['code'] ;
         }

        done();
      });
    });
  
    describe("- Update, unpause and delete monitor", function(){

      beforeAll( function(){
        if( !existingMonitorCode ){
          throw new Error("monitor not created");
          process.abort();
        }
      });


      it("- should update monitor", function(done){
          var callback = jasmine.createSpy("callback");
          var updateMonitor = {
              "name": "Testing_Cronitor_Client",
              "notifications": {
                  "phones": [], 
                  "webhooks": [], 
                  "emails": [
                      "chantu@xyz.com"
                  ]
              }, 
              "rules": {
                "new" : [
                  {
                      "rule_type": "not_run_in", 
                      "duration": 1, 
                      "time_unit": "minutes"
                  },
                  {
                      "rule_type": "ran_longer_than", 
                      "duration": 2, 
                      "time_unit": "minutes"
                  }
                ]
              },
              "note": "Created by cronitor.io node.js client: version 2"
          };

          cc.update( existingMonitorCode, updateMonitor, function(err, body){
            callback(err,body);
            expect( callback).toHaveBeenCalled();
            expect( callback.calls.mostRecent().args[0] ).toBe(null);
            expect( typeof callback.calls.mostRecent().args[1]).toBe('object');
            done();
          });
      });


      it("- should unpause monitor", function(done){
        var callback = jasmine.createSpy("callback");

        cc.unpause( existingMonitorCode, function(err, body){
          callback(err,body);
          expect( callback).toHaveBeenCalled();
          expect( callback.calls.mostRecent().args[0] ).toBe(null);
          expect( typeof callback.calls.mostRecent().args[1]).toBe('string');
          done();
        });
      });


      it("- should delete monitor", function(done){
        
        var callback = jasmine.createSpy("callback");
        cc.delete( existingMonitorCode, function(err, body){
          callback(err,body);
          if( err){
            conosole.log("Please delete the monitor manually: 'Testing_Cronitor_Client'");
          }
          expect( callback).toHaveBeenCalled();
          expect( callback.calls.mostRecent().args[0] ).toBe(null);
          done();
        });
      });

    });

    


  });

});
