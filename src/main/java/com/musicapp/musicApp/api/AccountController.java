package com.musicapp.musicApp.api;

import com.musicapp.musicApp.core.ApplicationException;
import com.musicapp.musicApp.core.contracts.AccountService;
import com.musicapp.musicApp.core.message.account.AccountResponse;
import com.musicapp.musicApp.core.message.account.UpdateAccountRequest;
import com.musicapp.musicApp.core.message.common.FileResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("api/v1/account")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @GetMapping
    public AccountResponse get() {
        return accountService.get();
    }

    @PostMapping(consumes = "multipart/form-data")
    @Transactional
    public AccountResponse update(
            @RequestPart UpdateAccountRequest request,
            @RequestPart(required = false) MultipartFile avatar
    ) throws ApplicationException, IOException {
        return accountService.update(request, avatar);
    }

    @GetMapping(value = "/check/username")
    public boolean checkUsername(@RequestParam String username) {
        return accountService.checkExistsByUsername(username);
    }

    @GetMapping(value = "/check/email")
    public boolean checkEmail(@RequestParam String email) {
        return accountService.checkExistsByEmail(email);
    }

    @GetMapping(value = "/{id}/avatar")
    public ResponseEntity<Resource> getAvatar(@PathVariable String id) throws ApplicationException, IOException {
        final FileResponse response = accountService.getAvatar(id);

        return response == null ?
                ResponseEntity.notFound().build()
                :
                ResponseEntity.ok()
                        .contentType(MediaType.valueOf(response.getContentType()))
                        .body(response.getResource());
    }

}
