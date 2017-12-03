var AdministratorObject = function() {
    
            function Administrator(admrID, admrName, roleID, roleName, admrPH, admrE) {
                this.adminID = admrID;
                this.admin_name = admrName;
                this.role_id = roleID;
                this.role_name = roleName;
                this.adminPhone = admrPH;
                this.admin_email = admrE;
                }
        
    return {
              Administrator: Administrator
           }; 
    };