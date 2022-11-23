package kr.uracle.smile.module.idverif;

import com.dreamsecurity.crypt.MsgCrypto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.context.ServletContextAware;

import javax.servlet.ServletContext;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

@Service
public class IdVerifService implements ServletContextAware {

    @Value("${identity.verification.key.password}")
    private String keyPassword;

    private String certPath;

    public IdVerifService() {
    }

    @Override
    public void setServletContext(ServletContext servletContext) {
        certPath = servletContext.getRealPath("WEB-INF/dreamsecurity");
    }

    public String getEncryptedRequestInfo() throws UnsupportedEncodingException {
        MsgCrypto mscr = new MsgCrypto();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyyMMddHHmmss");
        String urlCode = "01005";
        String reqNum = UUID.randomUUID().toString().replace("-", "").substring(0, 30);
        String reqDate = sdf.format(new Date());
        String reqInfo = String.format("%s/%s/%s", urlCode, reqNum, reqDate);
        String encReqInfo = URLEncoder.encode(mscr.msgEncrypt(reqInfo, certPath + "/uracleCert.der"), "UTF-8");

        return encReqInfo;
    }

    public IdVerifResult getDecryptedResult(String priInfo) throws UnsupportedEncodingException {
        MsgCrypto mscr = new MsgCrypto();
        String rstInfo = mscr.msgDecrypt(URLDecoder.decode(priInfo, "UTF-8"),
                certPath + "/uraclePri.key", keyPassword, "EUC-KR");
        String[] rstInfoArray = rstInfo.split("/");

        IdVerifResult body = new IdVerifResult();

        if(rstInfoArray.length > 3) {
            body.setCode(rstInfoArray[0]);
            body.setCi(rstInfoArray[1]);
            body.setDi(rstInfoArray[2]);
            body.setPhone(rstInfoArray[3]);
            body.setProvider(rstInfoArray[4]);
            body.setBirth(rstInfoArray[5]);
            body.setSex(rstInfoArray[6].equals("1") ? IdVerifResult.SEX.M : IdVerifResult.SEX.F);
            body.setNation(rstInfoArray[7].equals("0") ? IdVerifResult.NATION.C : IdVerifResult.NATION.F);
            body.setName(rstInfoArray[8]);
            body.setRequestNum(rstInfoArray[9]);
            body.setDatetime(rstInfoArray[10]);
        } else {
            body.setCode(rstInfoArray[0]);
            body.setMessage(rstInfoArray[1]);
        }

        return body;
    }
}
