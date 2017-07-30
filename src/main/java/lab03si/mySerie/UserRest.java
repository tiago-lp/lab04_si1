package lab03si.mySerie;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class UserRest {

	@Autowired
	private UserService userService;
	
	private User loggedUser = new User(false);
	
	@RequestMapping(method = RequestMethod.GET)
	public User getLoggedUser() {
		return this.loggedUser;
	}
	
	@RequestMapping(value = "/logout", method = RequestMethod.POST)
	public void logout() {
		this.loggedUser = new User(false);
	}
	
	@RequestMapping(value = "/login", method = RequestMethod.POST)
	public ResponseEntity<User> login(@RequestBody User user) throws Exception {
		User currentUser = userService.login(user);
		this.loggedUser = currentUser;
		ResponseEntity<User> data = (currentUser != null) ? new ResponseEntity<User>(currentUser, HttpStatus.OK) : new ResponseEntity<User>(HttpStatus.UNAUTHORIZED); 
		return data;
	}

	@RequestMapping(value = "/signin", method = RequestMethod.POST)
	public ResponseEntity<User> signIn(@RequestBody User newUser) throws Exception {
		User user = userService.registerUser(newUser);
		return ResponseEntity.ok(user);
	}
	
	@RequestMapping(value = "/update", method = RequestMethod.PUT)
	public void updateUser(@RequestBody User user) {
		this.loggedUser = userService.updateUser(user);
	}
}
