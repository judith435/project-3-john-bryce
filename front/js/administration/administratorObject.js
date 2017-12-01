var AdministratorObject = function() {
    
            function Administrator(admrID, admrName, roleID, roleName, admrPH, admrE) {
                this.admin_id = admrID;
                this.admin_name = admrName;
                this.role_id = roleID;
                this.role_name = roleName;
                this.admin_phone = admrPH;
                this.admin_email = admrE;
                }
        
    return {
              Administrator: Administrator
           }; 
    };