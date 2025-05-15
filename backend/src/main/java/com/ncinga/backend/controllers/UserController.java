package com.ncinga.backend.controllers;

import com.ncinga.backend.documents.User;
import com.ncinga.backend.dtos.LdapUser;
import com.ncinga.backend.dtos.UserDto;
import com.ncinga.backend.repos.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.naming.*;
import javax.naming.directory.*;
import java.util.Hashtable;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping(path = "/user")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepo userRepo;  // Injecting the User repository

    @PostMapping(path = "/login")
    public ResponseEntity<String> login(@RequestBody UserDto userDto) {
        // Find the user by username from the MongoDB database
        User user = userRepo.findByUsername(userDto.username());
        if (user != null && user.getPassword().equals(userDto.password())) {
            // If user is found and password matches, return the user's email
            return ResponseEntity.ok(user.getEmail());
        } else {
            // If authentication fails, return an unauthorized error
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("INVALID_AUTH");
        }
    }


    @PostMapping(path = "/add")
    public ResponseEntity<String> addUser(@RequestBody User user) {
        // Check if the user already exists
        User existingUser = userRepo.findByUsername(user.getUsername());
        if (existingUser != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("User already exists");
        }

        // Add a new user to the MongoDB collection
        userRepo.save(user);
        return ResponseEntity.ok("User added successfully!");
    }

//    @Value("${ldap.enabled}")
//    private boolean ldapEnabled;
//
//    @PostMapping(path = "/login")
//    public ResponseEntity<String> login(@RequestBody UserDto user) {
//        if (ldapEnabled) {
//            LdapUser ldapUser = ldapLogin(user);
//            if (ldapUser.getEmail() != null && !ldapUser.getEmail().isEmpty()) { // auth pass
//                return ResponseEntity.ok(ldapUser.getEmail());
//            } else { // error
//                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("INVALID_AUTH");
//            }
//        } else {
//            // Fallback for local authentication (hardcoded user example)
//            return localLogin(user);
//        }
//    }
//
//    // Fallback for local testing (simple username/password check)
//    private ResponseEntity<String> localLogin(UserDto user) {
//        if ("admin".equals(user.username()) && "password123".equals(user.password())) {
//            return ResponseEntity.ok("admin@localhost.com");
//        } else {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("INVALID_AUTH");
//        }
//    }
//
//    @Value("${ldap.urls}")
//    private String ldapUrl;
//
//    @Value("${ldap.base}")
//    private String base;
//
//    @Value("${ldap.group}")
//    private String authGroup;
//
//    @Value("${ldap.whitelist}")
//    private String whiteList;
//
//    public LdapUser ldapLogin(UserDto user) {
//        LdapUser ldapUser = new LdapUser();
//        Hashtable<String, String> env = new Hashtable<>();
//        env.put(Context.INITIAL_CONTEXT_FACTORY, "com.sun.jndi.ldap.LdapCtxFactory");
//        env.put(Context.PROVIDER_URL, ldapUrl);
//        env.put(Context.SECURITY_AUTHENTICATION, "simple");
//        env.put(Context.SECURITY_PRINCIPAL, "DFCCNET\\" + user.username());
//        env.put(Context.SECURITY_CREDENTIALS, user.password());
//        env.put(Context.REFERRAL, "ignore");
//
//        DirContext ctx = null;
//        try {
//            ctx = new InitialDirContext(env);
//            System.out.println(" ********** connected ************");
//            String searchBase = base;
//            String searchFilter = "(sAMAccountName=" + user.username() + ")";
//            SearchControls searchControls = new SearchControls();
//            searchControls.setSearchScope(SearchControls.SUBTREE_SCOPE);
//            NamingEnumeration<SearchResult> results = ctx.search(searchBase, searchFilter, searchControls);
//            String[] whiteListEmail = whiteList.split("\\,");
//            boolean authorizedUser = false;
//            while (results.hasMore()) {
//                SearchResult searchResult = results.next();
//                Attributes attributes = searchResult.getAttributes();
//                Attribute userPrincipalName = attributes.get("userPrincipalName");
//                Attribute name = attributes.get("name");
//                Attribute distinguishedName = attributes.get("distinguishedName");
//                System.out.println("userPrincipalName: " + (userPrincipalName != null ? userPrincipalName.get() : ""));
//                System.out.println("name: " + (name != null ? name.get() : ""));
//                for (String email : whiteListEmail) {
//                    if (email.equalsIgnoreCase(userPrincipalName.get().toString())) {
//                        authorizedUser = true;
//                        break;
//                    }
//                }
//                Pattern pattern = Pattern.compile("OU=([^,]+)");
//                Matcher matcher = pattern.matcher(distinguishedName.get().toString());
//                while (matcher.find()) {
//                    String[] ar = matcher.group().split("\\=");
//                    System.out.println(ar[0]);
//                    System.out.println(ar[1]);
//                    if (ar[1].equalsIgnoreCase(authGroup)) {
//                        authorizedUser = true;
//                        break;
//                    }
//                }
//
//                if (authorizedUser) {
//                    System.out.println(" ********** find as authorized User ************");
//                    ldapUser.setEmail((userPrincipalName != null ? userPrincipalName.get().toString() : ""));
//                    ldapUser.setDisplayName((name != null ? name.get().toString() : ""));
//                }
//            }
//        } catch (AuthenticationNotSupportedException ex) {
//            ex.printStackTrace();
//        } catch (AuthenticationException ex) {
//            ex.printStackTrace();
//        } catch (NamingException ex) {
//            ex.printStackTrace();
//        } catch (Exception ex) {
//            ex.printStackTrace();
//        } finally {
//            try {
//                if (ctx != null) {
//                    ctx.close();
//                    System.out.println(" ********** connection closed ************");
//                }
//            } catch (NamingException e) {
//                e.printStackTrace();
//            }
//        }
//        return ldapUser;
//    }
}
