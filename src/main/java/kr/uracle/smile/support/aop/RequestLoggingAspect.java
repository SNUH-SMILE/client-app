package kr.uracle.smile.support.aop;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Aspect
@Component
public class RequestLoggingAspect {
    @Around("execution(public String kr.uracle.smile.module..*Controller.*(..))")
    public Object logging(ProceedingJoinPoint joinPoint) throws Throwable {
        StringBuffer log = new StringBuffer();
        log.append(String.format("[%s] %s",
                joinPoint.getTarget().getClass().getSimpleName(), joinPoint.getSignature().getName()));

        List<Object> args = Arrays.stream(joinPoint.getArgs()).filter(arg -> arg != null && (arg.getClass().isPrimitive()
                                || (arg.getClass().getName().startsWith("kr.uracle.smile") )))
                        .collect(Collectors.toList());

        if(!args.isEmpty()) {
            log.append(" => ");
            log.append(args);
        }

        logger.trace(log.toString());

        return joinPoint.proceed();
    }
}
