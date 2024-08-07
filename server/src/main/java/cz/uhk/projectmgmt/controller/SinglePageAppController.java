package cz.uhk.projectmgmt.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SinglePageAppController {

    /**
     * If the user refreshes the page while on a React route, the request will come here.
     * We need to tell it that there isn't any special page, just keep using React, by
     * forwarding it back to the root.
     */
    @RequestMapping({"/ui/**"})
    public String forward(HttpServletRequest httpServletRequest) {
        return "forward:/";
    }
}